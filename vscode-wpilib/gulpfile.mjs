/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { src, dest, task, series } from 'gulp';

import ts from 'gulp-typescript';
import typescript from 'typescript';
import sourcemaps from 'gulp-sourcemaps';
import yaml from 'gulp-yaml';
import jsontransform from 'gulp-json-transform';
import { deleteAsync } from "del";
import { createAdditionalLanguageFiles } from 'vscode-nls-dev';

// If all VS Code langaues are support you can use nls.coreLanguages
const languages = [{
	id: 'zh-CN'
}];

const defaultActivationEvents = [
	"workspaceContains:.wpilib/wpilib_preferences.json",
	"workspaceContains:build/vscodeconfig.json"
]

//---- internal

function updateActivationCommands() {
	return src(['./package.json'])
		.pipe(jsontransform((data) => {
			const activationEvents = [];
			for (const evnt of defaultActivationEvents) {
				activationEvents.push(evnt);
			}
			for (const cmd of data.contributes.commands) {
				activationEvents.push(`onCommand:${cmd.command}`);
			}
			data.activationEvents = activationEvents;
			return data;
		}, 4))
		.pipe(dest('./'));
}

task('update-activation', () => {
	return updateActivationCommands();
});

task('i18n-compile', function (){
	return src('./locale/**/*.yaml')
		.pipe(yaml())
		.pipe(dest('./i18n/'))
});

task('i18n-additional', function() {
	return src(['package.nls.json'])
		.pipe(createAdditionalLanguageFiles(languages, 'i18n'))
		.pipe(dest('.'));
});

task('clean', function() {
	return deleteAsync(["package.nls.*.json", "vscode-wpilib*.vsix"]);
})

task('build', series('clean', 'i18n-compile', 'i18n-additional', 'update-activation'));

task('default', series('build'));
