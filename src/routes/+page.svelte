<script lang="ts">
  import MarkdownEditor from "$lib/components/layout/panes/markdownEditor/MarkdownEditor.svelte";
</script>

<div id="mainPage">
  <a href="/test">Test Page</a>
  <a href="/five-up">Five Up Page</a>
  <MarkdownEditor />
</div>

<style>
  #mainPage {
    height: calc(100vh - 44px);
    overflow: hidden;
    margin-left: 4px;
    margin-right: 4px;
    border-radius: 10px;
  }
</style>
