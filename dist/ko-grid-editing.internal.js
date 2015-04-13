/*
 * Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
define(['onefold-dom', 'indexed-list', 'stringifyable', 'onefold-lists', 'onefold-js', 'ko-grid-cell-navigation', 'ko-data-source', 'ko-indexed-repeat', 'ko-grid', 'knockout'],    function(onefold_dom, indexed_list, stringifyable, onefold_lists, onefold_js, ko_grid_cell_navigation, ko_data_source, ko_indexed_repeat, ko_grid, knockout) {
var ko_grid_editing_editing, ko_grid_editing;

var cellNavigation = 'ko-grid-cell-navigation';
ko_grid_editing_editing = function (module, ko, koGrid) {
  var extensionId = 'ko-grid-editing'.indexOf('/') < 0 ? 'ko-grid-editing' : 'ko-grid-editing'.substring(0, 'ko-grid-editing'.indexOf('/'));
  var HIDDEN_TOP = '0', HIDDEN_LEFT = '-8px', HIDDEN_RIGHT = '', HIDDEN_BOTTOM = '0', HIDDEN_WIDTH = '7px', VISIBLE_TOP = '0', VISIBLE_LEFT = '0', VISIBLE_RIGHT = '0', VISIBLE_BOTTOM = '0', VISIBLE_WIDTH = '';
  var KEY_CODE_TAB = 9, KEY_CODE_ENTER = 13, KEY_CODE_SHIFT = 16, KEY_CODE_ESCAPE = 27, KEY_CODE_ARROW_LEFT = 37, KEY_CODE_ARROW_DOWN = 40, KEY_CODE_F1 = 112, KEY_CODE_F2 = 113, KEY_CODE_F3 = 114, KEY_CODE_F12 = 123;
  var ACTIVATED_START_INDEX = 4, PASS_THROUGH_KEY_RANGES = [
      [
        KEY_CODE_ARROW_LEFT,
        KEY_CODE_ARROW_DOWN
      ],
      [
        KEY_CODE_TAB,
        KEY_CODE_TAB
      ],
      [
        KEY_CODE_ENTER,
        KEY_CODE_ENTER
      ],
      [
        KEY_CODE_ESCAPE,
        KEY_CODE_ESCAPE
      ],
      [
        KEY_CODE_SHIFT,
        KEY_CODE_SHIFT
      ],
      [
        KEY_CODE_F1,
        KEY_CODE_F1
      ],
      [
        KEY_CODE_F3,
        KEY_CODE_F12
      ],
      [
        KEY_CODE_F2,
        KEY_CODE_F2
      ]
    ], PRE_ACTIVATION_END_INDEX = PASS_THROUGH_KEY_RANGES.length - 1;
  var NO_SUBSCRIPTION = {
    dispose: function () {
    }
  };
  koGrid.defineExtension(extensionId, {
    dependencies: [cellNavigation],
    Constructor: function EditingExtension(bindingValue, config, grid) {
      var createEditor = bindingValue['createEditor'] || config['createEditor'] || function () {
          return null;
        }, saveChange = bindingValue['saveChange'] || config['saveChange'] || function () {
          return window.console.warn('No `saveChange` strategy provided.');
        };
      var editingRow = null, editingColumn = null, editorContainer = null, editor = null, activated = false, keyDownSubscription = NO_SUBSCRIPTION;
      grid.data.onCellDoubleClick(function () {
        if (editor) {
          activate();
          editor.activate();
        }
      });
      grid.extensions[cellNavigation].onCellFocused(function (row, column, binding) {
        keyDownSubscription.dispose();
        keyDownSubscription = NO_SUBSCRIPTION;
        var rawEditor = createEditor(row, column);
        if (!rawEditor)
          return;
        editorContainer = window.document.createElement('div');
        editorContainer.style.position = 'absolute';
        editorContainer.style.top = HIDDEN_TOP;
        editorContainer.style.left = HIDDEN_LEFT;
        editorContainer.style.right = HIDDEN_RIGHT;
        editorContainer.style.bottom = HIDDEN_BOTTOM;
        editorContainer.style.width = HIDDEN_WIDTH;
        editorContainer.style.overflow = 'hidden';
        editor = new EditorWrapper(rawEditor);
        var editorElement = editor.element;
        editorContainer.appendChild(editorElement);
        editorElement.classList.add('ko-grid-editor');
        editorElement.style.boxSizing = 'border-box';
        editorElement.style.width = '100%';
        editorElement.style.height = '100%';
        activated = false;
        keyDownSubscription = grid.onKeyDown('.ko-grid-editor', function (e) {
          var keyCode = e.keyCode;
          if (isPassThroughKeyCode(keyCode))
            return;
          else if (e.keyCode === KEY_CODE_ESCAPE) {
            e.preventDefault();
            reset();
            deactivate();
          } else if (!e.ctrlKey && keyCode === KEY_CODE_ENTER || keyCode === KEY_CODE_TAB)
            return save();
          else if (!activated && !e.ctrlKey && !e.altKey)
            activate();
          e.preventApplicationButAllowBrowserDefault();
        });
        function isPassThroughKeyCode(keyCode) {
          var startIndex = activated ? ACTIVATED_START_INDEX : 0, endIndex = activated ? PASS_THROUGH_KEY_RANGES.length : PRE_ACTIVATION_END_INDEX;
          for (var i = startIndex, l = endIndex; i < l; ++i) {
            var RANGE = PASS_THROUGH_KEY_RANGES[i];
            if (RANGE[0] <= keyCode && RANGE[1] >= keyCode) {
              return true;
            }
          }
          return false;
        }
        return {
          init: function (element, row, column) {
            var $__arguments = arguments;
            editingRow = row;
            editingColumn = column;
            binding.init.apply(this, $__arguments);
            element.appendChild(editorContainer);
            if (activated)
              editor.focus();
            else
              editor.activate();
          },
          update: binding.update
        };
      });
      function activate() {
        activated = true;
        editorContainer.style.top = VISIBLE_TOP;
        editorContainer.style.left = VISIBLE_LEFT;
        editorContainer.style.right = VISIBLE_RIGHT;
        editorContainer.style.bottom = VISIBLE_BOTTOM;
        editorContainer.style.width = VISIBLE_WIDTH;
      }
      function deactivate() {
        activated = false;
        editorContainer.style.top = HIDDEN_TOP;
        editorContainer.style.left = HIDDEN_LEFT;
        editorContainer.style.right = HIDDEN_RIGHT;
        editorContainer.style.bottom = HIDDEN_BOTTOM;
        editorContainer.style.width = HIDDEN_WIDTH;
        editor.activate();
      }
      function reset() {
        editor.reset();
      }
      function save() {
        if (editor.valueChanged)
          saveChange(editingRow, editingColumn, editor.value);
      }
    }
  });
  /** @constructor */
  function EditorWrapper(editor) {
    this.__editor = editor;
  }
  EditorWrapper.prototype = {
    get element() {
      return this.__editor['element'];
    },
    get value() {
      return this.__editor['value'];
    },
    set value(newValue) {
      this.__editor['value'] = newValue;
    },
    get valueChanged() {
      return this.__editor['valueChanged'];
    },
    activate: function () {
      this.__editor['activate']();
    },
    focus: function () {
      this.__editor['focus']();
    },
    reset: function () {
      this.__editor['reset']();
    }
  };
  return koGrid.declareExtensionAlias(['editing'], extensionId);
}({}, knockout, ko_grid);
ko_grid_editing = function (main) {
  return main;
}(ko_grid_editing_editing);return ko_grid_editing;
});