# Composable GitHub Block Template

In this repository is a template (built with [Vite](https://vitejs.dev/), [React](https://reactjs.org/) and [Typescript](https://www.typescriptlang.org/)) for developing "blocks" for use in [Composable Github]().

## Install Dependencies

```bash
yarn
```

## Develop locally

```bash
yarn dev
```

A development server should now be running on [localhost:4000](localhost:4000).

## Build Action

TBD, explain that the bundled build file won't really work to run as a self-contained prod app. 

## Sandbox

When you visit the development server in your browser, you should see two inputs:

1. An `input` that accepts the direct path to a file or a directory on github.com. Below is a list of some valid file/directory paths.

- https://github.com/facebook/react/blob/main/README.md (file)
- https://github.com/facebook/react/blob/0.3-stable/README.md (file)
- https://github.com/facebook/react/blob/main/packages/react-dom/index.js (file)
- https://github.com/facebook/react/ (folder)
- https://github.com/facebook/react/tree/0.3-stable (folder)
- https://github.com/facebook/react/tree/main/packages (folder)

2. A `select` that lists out the contents of the `blocks` array that you have defined in your package.json. More on that in the next section.

Once you've entered a valid path, choose from the different block types and the content _should_ be rendered beneath. Be sure to check your console for errors if you think something has broken!

## Developing blocks

First, open `package.json` and locate the `blocks` key. You'll notice an array of block objects that all have the same shape (note that all of the fields are currently required).

```ts
interface BlockDefinition {
  type: "file" | "folder";
  title: string;
  description: string;
  entry: string;
  extensions: string[];
}
```

From top to bottom,

- `type` determines whether this block applies to, well, files or folders.
- `title` and `description` are both presentational attributes that affect how the block will appear on the marketplace
- `entry` is the most important attribute, and its value should be a file path (relative to `/src`) to your block's entry point.
- `extensions` is an array of file extensions (without the leading dot) which lets Composable GitHub know for which types of files this block should be listed. `*` represents a wildcard value, meaning the block will always be listed.

With your block definition in place, let's take a look at the source code for a given block.

### File Blocks

A file block is a React component that receives a special set of
props and returns some JSX. Specifically, the props look like:

```ts
interface FileBlockProps {
  // (todo): provide correct typing here
  metadata: any;
  content: string;
  context: {
    download_url: string;
    file: string;
    path: string;
    repo: string;
    owner: string;
    sha: string;
    username: string;
  };
}
```

For simple use cases, the `content` prop will be the most useful, as it represents the actual content of the file you're looking at on the Composable GitHub UI. But if you need additional context (such as the path to the file, the raw download URL of the file, or the owner/repo in which the file lives), you can access it via the handy `context` prop.

A few caveats and callouts:

- You can use both third-party _and_ relative imports in your block code! Simply put, feel free to install any dependencies from NPM, or import a local JS/CSS file and it should be included in the final bundle.
- Your block entry file **must export a function a named Block**. If it does not, bad things will happen.

### Folder Blocks

A folder block is also a React component that receives a special set of props and returns some JSX. Specifically, the props look like:

```ts
interface FolderBlockProps {
  // (todo): provide correct typing here
  metadata: any;
  tree: {
    path: string;
    mode: string;
    type: string;
    sha: string;
    size: number;
    url: string;
  }[];
  context: {
    download_url: string;
    file: string;
    path: string;
    repo: string;
    owner: string;
    sha: string;
    username: string;
  };
}
```

For simple use cases, the `tree` prop will be the most useful, as it represents the underlying file tree of the directory you're looking at on the Composable GitHub UI. But if you need additional context (such as the path to the file, the raw download URL of the file, or the owner/repo in which the file lives), you can access it via the handy `context` prop.

A few caveats and callouts:

- You can use both third-party _and_ relative imports in your block code! Simply put, feel free to install any dependencies from NPM, or import a local JS/CSS file and it should be included in the final bundle.
- Your block entry file **must export a function a named Block**. If it does not, bad things will happen.

## @githubnext/utils

To reduce the cognitive load associated with writing file and folder block components, we've assembled a helper library called `@githunext/utils` that exposes interface definitions and a few helper functions. This list will undoubtedly change over time, so be sure to check out [the repository page](https://github.com/githubnext/utils) for more detail.

```tsx
import {
  FileBlockProps,
  FolderBlockProps,
  // A nifty hook that allows you to use Tailwind classes in your block component without *any* set up! 🎉
  useTailwindCdn,
  // A helper function that returns the "language" of a file, given a valid file path with extension.
  getLanguageFromFilename
} from '@githubnext/utils`
```
