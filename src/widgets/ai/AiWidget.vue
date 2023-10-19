<template>
  <div class="search-box">
    <img class="logo" src="/chatgpt.png">
    <textarea placeholder="输入您的问题，再按回车" @keydown.enter.prevent="onEnter" v-model="keyword" class=""/>
    <loading v-show="loading"></loading>
  </div>
  <div class="result-box">
    <div class="markdown-body" v-html="answer"></div>
  </div>
</template>
<script lang="ts">
import Loading from "@/widgets/chatgpt-search/Loading.vue";
import {nextTick, onMounted, ref} from "vue";
import {Configuration, OpenAIApi} from "openai";
import {marked} from 'marked';
import hljs from "highlight.js";
import 'highlight.js/styles/github.css';
import {delay} from "@/utils/TimeUtils";

hljs.highlightAll();

export default {
  components: {Loading},
  setup() {
    const loading = ref(false);
    const configuration = new Configuration({
      apiKey: "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",
    });

    const openai = new OpenAIApi(configuration);
    const keyword = ref("用英语翻译：今天天气如何");
    const answer = ref();

    const str = '```js\n' +
        '// JavaScript代码\n' +
        '// 箭头函数\n' +
        'const arr = [1, 2, 3, 4, 5];\n' +
        'const double = arr.map((num) => num * 2);\n' +
        'console.log(double);\n' +
        '\n' +
        '// ES5写法\n' +
        'const arr = [1, 2, 3, 4, 5];\n' +
        'var double = arr.map(function(num) {\n' +
        '  return num * 2;\n' +
        '});\n' +
        'console.log(double);\n' +
        '```'

    const str2 = '\n```js\n' +
        '// JavaScript代码\n' +
        '// 箭头函数\n' +
        'const arr = [1, 2, 3, 4, 5];\n' +
        'const double = arr.map((num) => num * 2);\n' +
        'console.log(double);\n' +
        '\n' +
        '// ES5写法\n' +
        'const arr = [1, 2, 3, 4, 5];\n' +
        'var double = arr.map(function(num) {\n' +
        '  return num * 2;\n' +
        '});\n' +
        'console.log(double);\n' +
        '```'

    const renderer = new marked.Renderer();
    renderer.code = function (code, lang: string) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      const id = `copy-${new Date().getTime()}`;
      const highlightResult = hljs.highlight(code, {language});
      const codeStr = `${highlightResult.code}`;
      console.log(highlightResult.value)
      return `<div class="code-block"><pre id="${id}"><code>${
          highlightResult.value
      }</code></pre> <div class="btn-copy" value="${codeStr}">复制</div></div>`;
    };

    marked.setOptions({
      renderer: renderer,
    })

    const updateCopyEvent = () => {
      const elements = document.querySelectorAll('.btn-copy');
      elements?.forEach((element) => {
        element.addEventListener('click', () => {
          console.log(element);
          const str = element.getAttribute("value");
          const textarea = document.createElement('textarea');
          textarea.value = str;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          textarea.remove();
        });
      })
    }

    answer.value = marked.parse(str + str2);
    const onEnter = () => {
      loading.value = true;
      openai.createCompletion({
        model: "text-davinci-003",
        prompt: keyword.value,
        max_tokens: 4000
      }).then(async (result) => {
        console.info(result.data)
        console.info(result.data.choices[0])
        answer.value = marked.parse(result.data.choices[0].text ?? "没有找到答案");
        await delay(1000);
        updateCopyEvent();
      }).catch((e) => {
        console.error(e)
      }).finally(() => {
        loading.value = false;
      });
    }
    return {
      updateCopyEvent, onEnter, answer, keyword, loading
    }
  },
  async mounted() {
    await nextTick();
    this.updateCopyEvent();
  }
}

</script>

<style lang="scss">
$box-height: 60px;
$margin: 16px;

.result-box, .search-box {
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  margin: $margin;
  width: calc(100% - 32px);
  min-height: $box-height;
  border-width: 1px;
  border-radius: 8px;
  padding: 8px 12px;
}

.result-box {
  border-radius: 0;

  .markdown-body {
    .code-block {
      position: relative;

      pre {
        padding: 16px;
        overflow: auto;
        line-height: 1.45;
        background-color: #f6f8fa;
        border-radius: 6px;
      }

      .btn-copy {
        position: absolute;
        width: 40px;
        user-select: none;
        cursor: pointer;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-radius: 8px;
        border-width: 1px;
        border-color: rgba(0, 0, 0, 0.47);
        border-style: solid;
        right: 8px;
        top: 8px;
      }
    }
  }
}

.search-box {
  min-height: $box-height;
  align-items: center;
  display: flex;

  textarea {
    display: flex;
    width: 80%;
    flex-grow: 1;
    font-family: Roboto, monospace, serif;
    font-size: calc($box-height / 2);
    margin-left: 8px;
    max-height: calc($box-height - 24px);
    border: none;
    background-color: transparent;
    overflow: hidden;
    -webkit-appearance: none;
    resize: none;
    outline: none;
  }

  .logo {
    width: calc($box-height - 24px);
    height: calc($box-height - 24px);
  }


}


</style>
