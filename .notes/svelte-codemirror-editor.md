<script lang="ts">
    import CodeMirror from "svelte-codemirror-editor";
    import { javascript } from "@codemirror/lang-javascript";

    let value = "";
</script>

<CodeMirror bind:value lang={javascript()} />

Properties
Property	Type	Description	Default value
value	string	The value that will be displayed and edited in the CodeMirror editor	""
basic	boolean	Whether to use CodeMirror basicSetup extensions.	true
lang	LanguageSupport	The language extension that will parse and highlight the value.	undefined
theme	Extension	The theme extension to customize the appearence of the editor.	undefined
extensions	Extension[]	Additional extensions to inject in the editor.	[]
useTab	boolean	Whether to use the Tab shortcut to handle indentation.	true
tabSize	number	The number of space of an indentation level.	2
editable	boolean	Whether to make the editor editable or not.	true
readonly	boolean	Whether to make the editor readonly or not.	false
lineWrapping	boolean	Whether to wrap lines in the editor or not.	false
placeholder	string	A placeholder to include when value is empty.	undefined
nodebounce	boolean	Whether to stop debouncing value updates.	false
styles	ThemeSpec	In-place theme configuration. See exemple below.	undefined
Events
Event	Type	Description
change	string	Trigger when the code changes.
ready	EditorView	Trigger when the editor is ready. Allows to retrieve the EditorView instance.
Usage with vite / svelte-kit
If you try to use this component with vite or svelte-kit, you have to disable dependency optimization for codemirror and all its extensions.

// vite.config.js
const config = {
    //...
    optimizeDeps: {
        exclude: ["svelte-codemirror-editor", "codemirror", "@codemirror/language-javascript" /* ... */],
    },
    //...
}
Exemples
Basic usage
<script lang="ts">
    import CodeMirror from "svelte-codemirror-editor";
    import { javascript } from "@codemirror/lang-javascript";

    let value = "";
</script>

<CodeMirror bind:value lang={javascript()} />
Custom theme
<script lang="ts">
    import CodeMirror from "svelte-codemirror-editor";
    import { javascript } from "@codemirror/lang-javascript";
    import { oneDark } from "@codemirror/theme-one-dark";

    let value = "";
</script>

<CodeMirror bind:value lang={javascript()} theme={oneDark} />
Custom styles
<script lang="ts">
    import CodeMirror from "svelte-codemirror-editor";
    import { javascript } from "@codemirror/lang-javascript";

    let value = "";
</script>

<CodeMirror
    bind:value
    lang={javascript()}
    styles={{
        "&": {
            width: "500px",
            maxWidth: "100%",
            height: "50rem",
        },
    }}
/>
Get EditorView instance
<script lang="ts">
    import CodeMirror from "svelte-codemirror-editor";
    let view: EditorView;
</script>

<CodeMirror on:ready={(e) => view = e.detail} />