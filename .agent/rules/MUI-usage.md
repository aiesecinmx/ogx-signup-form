---
trigger: always_on
---

Use the mui-mcp server to answer any MUI (Material UI) questions whenever you need to build a component:

- 1. call the "useMuiDocs" tool to fetch the docs of the package relevant in the question
- 2. call the "fetchDocs" tool to fetch any additional docs if needed using ONLY the URLs present in the returned content.
- 3. repeat steps 1-2 until you have fetched all relevant docs for the given question
- 4. use the fetched content to answer the question

Additionally, follow these guidelines:
* Don't use any MUI layout-related components. Use Tailwind for that
* Don't use sx for styling. If you need to modify MUI components use className or slotProps for that
