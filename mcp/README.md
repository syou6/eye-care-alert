# eyecare-mcp

MCP (Model Context Protocol) server exposing EYE CARE tools to Claude Desktop
and any other MCP-compatible client.

## Tools

- `about_20_20_20_rule` — short, citation-friendly explanation
- `start_eye_care_session` — URL to launch the live timer
- `list_articles` — full /learn article list with URLs
- `lookup_glossary_term` — definition for any glossary slug

## Local install for Claude Desktop

```bash
cd mcp
npm install
```

Then in `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "eyecare": {
      "command": "node",
      "args": ["/absolute/path/to/eye-care-alert/mcp/server.js"]
    }
  }
}
```

Restart Claude Desktop. The four tools above appear under the EYE CARE namespace.

## Publishing

Not published to npm yet. Run locally for now. To publish later:

```bash
cd mcp
npm publish --access public
```
