<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import * as Select from "$lib/components/ui/select";
  import type { ButtonProps } from "$lib/components/ui/button/button";

  interface ComponentConfig {
    component: any;
    props: Record<string, string[] | string>;
  }

  interface Components {
    [key: string]: ComponentConfig;
  }

  interface Props {
    variant: string;
    size: string;
    text: string;
  }

  const selectedComponent = $state("Button");
  const props = $state<Props>({
    variant: "default",
    size: "default",
    text: "Click me",
  });

  const components: Components = {
    Button: {
      component: Button,
      props: {
        variant: [
          "default",
          "destructive",
          "outline",
          "secondary",
          "ghost",
          "link",
        ],
        size: ["default", "sm", "lg", "icon"],
        text: "string",
      },
    },
  };

  $effect(() => {
    console.log(
      "Line 47 - +page.svelte - Component changed:",
      selectedComponent
    );
    const newProps: Props = {
      variant: "default",
      size: "default",
      text: "Click me",
    };

    const componentProps = components[selectedComponent].props;
    Object.entries(componentProps).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        newProps[key as keyof Props] = value[0];
      } else if (value === "string") {
        newProps[key as keyof Props] = "Click me";
      }
    });

    props = newProps;
  });

  function renderComponent(name: string, componentProps: Props) {
    const Component = components[name].component;
    if (name === "Button") {
      return <Button {...componentProps}>{componentProps.text}</Button>;
    }
    return <Button {...componentProps} />;
  }
</script>

<div class="container mx-auto p-4 space-y-4">
  <Card>
    <CardHeader>
      <CardTitle>Component Playground</CardTitle>
      <CardDescription
        >Test and preview Svelte 5 components in real-time</CardDescription
      >
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-[250px_1fr] gap-4">
        <!-- Controls -->
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Component</Label>
            <Select.Root
              value={selectedComponent}
              onValueChange={(val: string) => (selectedComponent = val)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select component" />
              </Select.Trigger>
              <Select.Content>
                {#each Object.keys(components) as component}
                  <Select.Item value={component}>{component}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>

          <div class="space-y-4">
            {#each Object.entries(components[selectedComponent].props) as [propName, propType]}
              <div class="space-y-2">
                <Label>{propName}</Label>
                {#if Array.isArray(propType)}
                  <Select.Root
                    value={props[propName as keyof Props]}
                    onValueChange={(val: string) =>
                      (props[propName as keyof Props] = val)}
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      {#each propType as value}
                        <Select.Item {value}>{value}</Select.Item>
                      {/each}
                    </Select.Content>
                  </Select.Root>
                {:else if propType === "string"}
                  <Input
                    type="text"
                    value={props[propName as keyof Props]}
                    oninput={(e: Event) => {
                      const target = e.target as HTMLInputElement;
                      props[propName as keyof Props] = target.value;
                    }}
                  />
                {/if}
              </div>
            {/each}
          </div>
        </div>

        <!-- Preview -->
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent class="flex items-center justify-center min-h-[200px]">
            {renderComponent(selectedComponent, props)}
          </CardContent>
        </Card>
      </div>
    </CardContent>
  </Card>

  <!-- Code Preview -->
  <Card>
    <CardHeader>
      <CardTitle>Code</CardTitle>
    </CardHeader>
    <CardContent>
      <pre class="bg-muted p-4 rounded-lg overflow-x-auto">
        <code
          >{`<${selectedComponent}
  ${Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join("\n  ")}
>${props.text}</${selectedComponent}>`}</code
        >
      </pre>
    </CardContent>
  </Card>
</div>
