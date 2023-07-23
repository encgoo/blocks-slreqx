# Blocks-slreqx

## Development env settings
### node
Need to install node >= 14. 
Use this to force lts nodejs. Otherwise v12 will be installed. Blocks needs 14.
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
```

If a public key is not found then:
```bash
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 23E7166788B63E1E
```

Now install node
```bash
sudo apt-get install -y nodejs
```

### yarn
Need to uninstall cmdtest first, then install yarn. Otherwise the wrong yarn is used.
```bash
sudo npm install -g yarn
```

## Getting started
```bash
yarn
yarn start
```


## Developement
[Reference](https://blocks.githubnext.com/githubnext/blocks/blob/main/docs/Developing%20blocks/1%20Intro.md?blockKey=githubnext__blocks-examples__markdown-block&fileRef=) of information.

A block is a React component. 

The Blocks platform supplies a content to render and hooks that a block can call the take actions like _updating_ content. Blocks platform runs on blocks.githubnext.com

### file block
Receives content of a file.

### folder block
Receives content of a folder.

This repo is a clone of the blocks-template. 

### Define custom block
In blocks.config.json, 



