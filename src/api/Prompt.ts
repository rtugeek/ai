export class Prompt {
  static mindMap: string = `帮我生成@{content}的思维导图，越详细越好。
以这种格式开头：
---
title: @{content}
---

注意事项：
1.不用带有这个语法标识\`\`\`markdown \`\`\`。
2.最后的结语也不用返回。
3.每个节点的子节点数量不超过30个。

其他说明：@{extra}

请直接回答问题，不要添加任何总结或结束语。
`
  static translate = `你是一个翻译专家，我的母语是{{firstLang}}，第二语言是{{secondLang}}。
1.如果我输入的是母语，帮我翻译成第二语言。
2.如果我输入的是第二语言，帮我翻译成母语。
3.请直接回答问题，不要添加任何总结或结束语。`

  static mermaidDiagram = `根据我发给你的内容，帮我生成一个mermaid格式的图表。
 1.不用带有这个语法标识\`\`\`mermaid \`\`\`。
 2.请直接回答问题，不要添加任何总结或结束语。`
}
