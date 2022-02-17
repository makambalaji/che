/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { injectable, inject } from 'inversify';
import { CLASSES } from '../inversify.types';
import { Editor } from '../pageobjects/ide/Editor';
import { QuickOpenContainer } from '../pageobjects/ide/QuickOpenContainer';
import { TopMenu } from '../pageobjects/ide/TopMenu';
import { Key } from 'selenium-webdriver';

export enum TerminalRendererType {
    canvas = 'canvas',
    dom = 'dom'
}

export enum AskForConfirmationType {
    never = 'never',
    ifRquired = 'ifRequired',
    always = 'always'
}

@injectable()
export class PreferencesHandler {

    constructor(
        @inject(CLASSES.Editor) private readonly editor: Editor,
        @inject(CLASSES.QuickOpenContainer) private readonly quickOpenContainer: QuickOpenContainer,
        @inject(CLASSES.TopMenu) private readonly topMenu: TopMenu) {
    }

    /**
     * Works properly only for the running workspace.
     */
    public async setPreferenceUsingUI(property: string, value: any) {
        const tabTitle: string = 'settings.json';

        await this.topMenu.selectOption('View', 'Find Command...');
        await this.quickOpenContainer.typeAndSelectSuggestion('Preferences:', 'Preferences: Open Preferences (JSON)');

        let editorText: string = await this.editor.getEditorVisibleText(tabTitle);
        if (!editorText) {
            editorText = '{}';
        }
        let preferences = JSON.parse(editorText);
        preferences[property] = value;

        await this.editor.deleteAllText(tabTitle);
        await this.editor.type(tabTitle, JSON.stringify(preferences), 1);
        await this.editor.type(tabTitle, Key.chord(Key.CONTROL, Key.SHIFT, 'i'), 1);
    }

}
