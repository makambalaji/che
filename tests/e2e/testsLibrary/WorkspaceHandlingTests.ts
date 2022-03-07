/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { CLASSES } from '../inversify.types';
import { Dashboard } from '../pageobjects/dashboard/Dashboard';
import { CreateWorkspace } from '../pageobjects/dashboard/CreateWorkspace';
import { Workspaces } from '../pageobjects/dashboard/Workspaces';
import { BrowserTabsUtil } from '../utils/BrowserTabsUtil';
import { Logger } from '..';

@injectable()
export class WorkspaceHandlingTests {

    private static workspaceName: string = 'undefined';

    public static getWorkspaceName(): string {
        return WorkspaceHandlingTests.workspaceName;
    }

    constructor(
        @inject(CLASSES.Dashboard) private readonly dashboard: Dashboard,
        @inject(CLASSES.CreateWorkspace) private readonly createWorkspace: CreateWorkspace,
        @inject(CLASSES.Workspaces) private readonly workspaces: Workspaces,
        @inject(CLASSES.BrowserTabsUtil) private readonly browserTabsUtil: BrowserTabsUtil) {}

    public getWorkSpaceName(stack: string) {
        switch (stack) {
            case 'Go':
                return 'golang-echo-example';
            case 'Python':
                return 'python-hello-world';
            case 'C/C++':
                return 'cpp';
            case 'ASP.NET Core Web Application':
                return 'asp-net';
            case 'Java Spring Boot':
                return 'spring-petclinic';
            default:
                break;
        }
    }

    public createAndOpenWorkspace(stack: string) {
        test(`Open 'New Workspace' page`, async () => {
            await this.dashboard.waitPage();
            await this.dashboard.clickCreateWorkspaceButton();
            await this.createWorkspace.waitPage();
            const parentGUID = await this.browserTabsUtil.getCurrentWindowHandle();
            await this.createWorkspace.clickOnSample(stack);
            await this.browserTabsUtil.switchToWindow(parentGUID);
            WorkspaceHandlingTests.workspaceName = await this.dashboard.getRecentWorkspaceName(10000);
            Logger.debug(`Workspace Name is: ${WorkspaceHandlingTests.workspaceName}`);
            await this.browserTabsUtil.waitAndSwitchToAnotherWindow(parentGUID, 10000);
            // in url, workspace is not displaying currently --> // WorkspaceHandlingTests.workspaceName = await this.workspaceNameHandler.getNameFromUrl();
        });
    }

    public openExistingWorkspace(workspaceName: string) {
        test('Start workspace', async () => {
            await this.dashboard.waitPage();
            await this.dashboard.clickWorkspacesButton();
            await this.workspaces.waitPage();
            await this.workspaces.clickOpenButton(workspaceName);
        });
    }

    public async stopWorkspace(workspaceName: string) {
        await this.dashboard.openDashboard();
        await this.dashboard.stopWorkspaceByUI(workspaceName);
    }

    public async removeWorkspace(workspaceName: string) {
        await this.dashboard.openDashboard();
        await this.dashboard.deleteStoppedWorkspaceByUI(workspaceName);
    }

    public async stopAndRemoveWorkspace(workspaceName: string) {
        await this.dashboard.openDashboard();
        await this.dashboard.stopAndRemoveWorkspaceByUI(workspaceName);
    }
}
