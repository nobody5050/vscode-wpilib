# VS Code WPILib

[![CI](https://github.com/wpilibsuite/vscode-wpilib/actions/workflows/main.yml/badge.svg)](https://github.com/wpilibsuite/vscode-wpilib/actions/workflows/main.yml)

This repository contains the WPILib VS Code extension.


## Build Dependencies
* Node JS - Tested with Node 18.
* Java - Tested with Java 17
* VS Code - For development/debugging.
  * TS Lint Extension
  * Chrome Debug Extension
  * In order to debug the extension, you will need the extension dependencies for the extension. The Microsoft C++ extension and the Java extension pack.

## Setting up Dependencies
In order to properly build, there is some setup that needs to occur.
1. Go into `vscode-wpilib` and run `npm install`
2. From the root, run `./gradlew updateAllDependencies`. This will grab the templates and examples from WPILib. This command will need to be reran any time you update the shared dependencies in the vscode project.
4. Open the root folder in VS Code.

## Building and Debugging
Once you have the project open in VS Code, there are 5 debugging targets set up.
* `Extension` Will launch the extension to debug
* `Extension Tests` Will launch the extension tests

In addition, each project has a `compile` and a `lint` npm command. These will compile and lint their respective projects. Please run these before submitting any PR, as CI will check these. In addition, VS Code's lint does not detect the same lint errors as running lint manually would.

## Testing
We highly recommend you do any testing by launching in the debugger. Unlike Eclipse, local building is not required to update WPILib versions, so building files to install is not exactly a simple setup. We will be posting instructions for this later, but not currently.
