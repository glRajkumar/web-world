import beautify from 'js-beautify'
import types from 'typescript'

export function compileTs(tsCode: string) {
  const result = types.transpileModule(tsCode, {
    compilerOptions: {
      module: types.ModuleKind.ESNext,
      target: types.ScriptTarget.ESNext,
    },
  })

  return result.outputText
}

export function beautify_js(code: string) {
  return beautify.js_beautify(code, {
    indent_size: 2,
    space_in_empty_paren: true,
    max_preserve_newlines: 2,
  })
}
