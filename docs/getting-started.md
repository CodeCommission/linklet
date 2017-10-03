# Getting Started

* [Installation](#installation)
* [CLI](#cli)
* [Setup a Microservice](#setup-a-microservice)
* [Programmers Guide](#programmers-guide)

## Installation

Linklet Microservice is super easy to set up. Just `npm install -g linklet`, write a HTTP Request/Response handler, and then use one of the following snippets to get started. For more info, read the Linklet Microservice docs.

```bash
npm install -g linklet
```

## CLI

```bash
linklet help
```

```bash
Usage: linklet [options] [command]


Options:

  -V, --version  output the version number
  -h, --help     output usage information


Commands:

  serve <name>   serve function
  create [name]  sreate function
  help [cmd]     display help for [cmd]
```

## Setup a Microservice

```bash
linklet create my-microservice
cd my-microservice

npm test #Test environment
npm run dev #Development environment
npm start #Production environment
```

## Programmers Guide

> coming soon