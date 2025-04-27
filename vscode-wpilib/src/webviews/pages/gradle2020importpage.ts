'use strict';

import { IGradle2020IPCReceive, IGradle2020IPCSend } from './gradle2020importpagetypes';
import { validateProject, validateTeamNumber, validateProjectFolder, validateXrpRomi } from './sharedpages';

interface IVsCodeApi {
  postMessage(message: IGradle2020IPCReceive): void;
}

declare function acquireVsCodeApi(): IVsCodeApi;

const vscode = acquireVsCodeApi();

// Wizard state
let currentStep = 1;

function navigateToStep(step: number) {
  // Hide all steps
  document.querySelectorAll('.wizard-step').forEach(el => {
    (el as HTMLElement).classList.remove('active');
  });
  
  // Show the target step
  const targetStep = document.getElementById(`step-${step}`);
  if (targetStep) {
    targetStep.classList.add('active');
  }
  
  // Update progress indicators
  document.querySelectorAll('.progress-step').forEach(el => {
    const stepNumber = parseInt((el as HTMLElement).getAttribute('data-step') || '0', 10);
    
    (el as HTMLElement).classList.remove('active', 'completed');
    
    if (stepNumber === step) {
      (el as HTMLElement).classList.add('active');
    } else if (stepNumber < step) {
      (el as HTMLElement).classList.add('completed');
    }
  });
  
  currentStep = step;
  
  // Update summary when navigating to the final step
  if (step === 3) {
    updateSummary();
  }
  
  // Validate current step
  validateCurrentStep();
}

function validateCurrentStep(): boolean {
  switch(currentStep) {
    case 1:
      return validateStep1();
    case 2:
      return validateStep2();
    case 3:
      return validateStep3();
    default:
      return true;
  }
}

function validateStep1(): boolean {
  const gradleInput = document.getElementById('gradle2020Input') as HTMLInputElement;
  const nextButton = document.getElementById('next-to-step-2') as HTMLButtonElement;
  
  if (gradleInput.value.trim() === '') {
    nextButton.disabled = true;
    return false;
  } else {
    nextButton.disabled = false;
    return true;
  }
}

function validateStep2(): boolean {
  const isValidProject = validateProject();
  const isValidFolder = validateProjectFolder();
  return isValidProject && isValidFolder;
}

function validateStep3(): boolean {
  const isValidTeam = validateTeamNumber();
  const isXrpRomiValid = validateXrpRomi();
  return isValidTeam && isXrpRomiValid;
}

function updateSummary() {
  const sourceEl = document.getElementById('summary-source');
  const destEl = document.getElementById('summary-destination');
  const teamEl = document.getElementById('summary-team');
  
  if (sourceEl) {
    sourceEl.textContent = (document.getElementById('gradle2020Input') as HTMLInputElement).value;
  }
  
  if (destEl) {
    const projectFolder = (document.getElementById('projectFolder') as HTMLInputElement).value;
    const projectName = (document.getElementById('projectName') as HTMLInputElement).value;
    const newFolder = (document.getElementById('newFolderCB') as HTMLInputElement).checked;
    
    destEl.textContent = newFolder ? `${projectFolder}/${projectName}` : projectFolder;
  }
  
  if (teamEl) {
    const teamNumber = (document.getElementById('teamNumber') as HTMLInputElement).value;
    teamEl.textContent = teamNumber ? teamNumber : 'Not specified';
  }
}

function gradle2020SelectButtonClick() {
  (document.activeElement as HTMLElement).blur();
  vscode.postMessage({ type: 'gradle2020' });
}

function projectSelectButtonClick() {
  (document.activeElement as HTMLElement).blur();
  vscode.postMessage({ type: 'newproject' });
}

function importProjectButtonClick() {
  const isValidTeam = validateTeamNumber();
  const isValidProject = validateProject();
  const isValidFolder = validateProjectFolder();
  const isXrpRomiValid = validateXrpRomi();
  if (!isValidTeam || !isValidProject || !isValidFolder || !isXrpRomiValid) {
    return;
  }

  (document.activeElement as HTMLElement).blur();
  vscode.postMessage({
    data: {
      desktop: (document.getElementById('desktopCB') as HTMLInputElement).checked,
      romi: (document.getElementById('romiCB') as HTMLInputElement).checked,
      xrp: (document.getElementById('xrpCB') as HTMLInputElement).checked,
      fromProps: (document.getElementById('gradle2020Input') as HTMLInputElement).value,
      newFolder: (document.getElementById('newFolderCB') as HTMLInputElement).checked,
      projectName: (document.getElementById('projectName') as HTMLInputElement).value,
      teamNumber: (document.getElementById('teamNumber') as HTMLInputElement).value,
      toFolder: (document.getElementById('projectFolder') as HTMLInputElement).value,
    },
    type: 'importproject',
  });
}

// Set up event handlers
function setupEventListeners() {
  // Step 1 navigation
  document.getElementById('gradle2020SelectButton')!.addEventListener('click', gradle2020SelectButtonClick);
  document.getElementById('next-to-step-2')!.addEventListener('click', () => {
    if (validateStep1()) {
      navigateToStep(2);
    }
  });
  
  // Step 2 navigation
  document.getElementById('projectSelectButton')!.addEventListener('click', projectSelectButtonClick);
  document.getElementById('back-to-step-1')!.addEventListener('click', () => navigateToStep(1));
  document.getElementById('next-to-step-3')!.addEventListener('click', () => {
    if (validateStep2()) {
      navigateToStep(3);
    }
  });
  
  // Step 3 navigation
  document.getElementById('back-to-step-2')!.addEventListener('click', () => navigateToStep(2));
  document.getElementById('importProject')!.addEventListener('click', importProjectButtonClick);
  
  // Form validation
  document.getElementById('projectName')!.addEventListener('input', () => {
    validateProject();
    validateCurrentStep();
  });
  document.getElementById('teamNumber')!.addEventListener('input', () => {
    validateTeamNumber();
    validateCurrentStep();
  });
  document.getElementById('projectFolder')!.addEventListener('input', () => {
    validateProjectFolder();
    validateCurrentStep();
  });
  document.getElementById('romiCB')!.addEventListener('change', () => {
    validateXrpRomi();
    validateCurrentStep();
  });
  document.getElementById('xrpCB')!.addEventListener('change', () => {
    validateXrpRomi();
    validateCurrentStep();
  });
  
  // Monitor gradle input for enabling next button
  const gradleInput = document.getElementById('gradle2020Input') as HTMLInputElement;
  gradleInput.addEventListener('input', validateStep1);
}

window.addEventListener('message', (event) => {
  const data = event.data as IGradle2020IPCSend;
  switch (data.type) {
    case 'gradle2020':
      (document.getElementById('gradle2020Input') as HTMLInputElement).value = data.data;
      validateStep1();
      break;
    case 'projectname':
      const doc = document.getElementById('projectName') as HTMLInputElement;
      doc.value = data.data;
      doc.disabled = false;
      validateProject();
      validateCurrentStep();
      break;
    case 'newproject':
      const elem = document.getElementById('projectFolder') as HTMLInputElement;
      elem.value = data.data;
      validateProjectFolder();
      validateCurrentStep();
      break;
    case 'teamnumber':
      const tn = document.getElementById('teamNumber') as HTMLInputElement;
      tn.value = data.data;
      validateTeamNumber();
      validateCurrentStep();
      break;
    default:
      break;
  }
});

window.addEventListener('load', (_: Event) => {
  setupEventListeners();
  navigateToStep(1); // Start at first step
  vscode.postMessage({ type: 'loaded' });
});
