import {
  AutoformatRule,
  createAutoformatPlugin,
  createHistoryPlugin,
  createListPlugin,
  createParagraphPlugin,
  createReactPlugin,
  createResetNodePlugin,
  createSlatePluginsComponents,
  createSlatePluginsOptions,
  createTodoListPlugin,
  ELEMENT_LI,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  ResetBlockTypePluginOptions,
  SlatePlugins,
  SPEditor,
  toggleList,
  unwrapList,
  WithAutoformatOptions,
} from "@udecode/slate-plugins";
import React from "react";

const App = () => {
  const components = createSlatePluginsComponents();
  const options = createSlatePluginsOptions();

  const preFormat: AutoformatRule["preFormat"] = (editor) =>
    unwrapList(editor as SPEditor);
  const optionsAutoformat: WithAutoformatOptions = {
    rules: [
      {
        type: options[ELEMENT_LI].type,
        markup: ["*", "-"],
        preFormat,
        format: (editor) => {
          toggleList(editor as SPEditor, { type: options[ELEMENT_UL].type });
        },
      },
      {
        type: options[ELEMENT_LI].type,
        markup: ["1.", "1)"],
        preFormat,
        format: (editor) => {
          toggleList(editor as SPEditor, { type: options[ELEMENT_OL].type });
        },
      },
      {
        type: options[ELEMENT_TODO_LI].type,
        markup: ["[]"],
      },
    ],
  };

  const resetBlockTypesCommonRule = {
    types: [options[ELEMENT_TODO_LI].type],
    defaultType: options[ELEMENT_PARAGRAPH].type,
  };

  const optionsResetBlockTypePlugin: ResetBlockTypePluginOptions = {
    rules: [
      {
        ...resetBlockTypesCommonRule,
        hotkey: "Enter",
        predicate: isBlockAboveEmpty,
      },
      {
        ...resetBlockTypesCommonRule,
        hotkey: "Backspace",
        predicate: isSelectionAtBlockStart,
      },
    ],
  };

  const plugins = [
    createReactPlugin(),
    createHistoryPlugin(),
    createParagraphPlugin(),
    createListPlugin(),
    createTodoListPlugin(),
    createAutoformatPlugin(optionsAutoformat),
    createResetNodePlugin(optionsResetBlockTypePlugin),
  ];
  return (
    <div className="app">
      <SlatePlugins
        plugins={plugins}
        components={components}
        options={options}
        initialValue={[{ children: [{ text: "" }] }]}
      />
    </div>
  );
};

export default App;
