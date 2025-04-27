'use strict';

// import { logger } from '../../logger';

declare global {
    interface Window { i18nTrans: (domain: string, message: string, ...args: unknown[]) => string; }
}

export function validateProject(): boolean {
  const projectName = document.getElementById('projectName') as HTMLInputElement;
  const error = document.getElementById('projectNameError') as HTMLElement;
  
  if (projectName.value.trim() === '') {
    projectName.classList.add('error');
    error.style.display = 'block';
    return false;
  } else {
    projectName.classList.remove('error');
    error.style.display = 'none';
    return true;
  }
}

export function validateProjectFolder(): boolean {
  const projectFolder = document.getElementById('projectFolder') as HTMLInputElement;
  const error = document.getElementById('projectFolderError') as HTMLElement;
  
  if (projectFolder.value.trim() === '') {
    projectFolder.classList.add('error');
    if (error) {
      error.style.display = 'block';
    }
    return false;
  } else {
    projectFolder.classList.remove('error');
    if (error) {
      error.style.display = 'none';
    }
    return true;
  }
}

export function validateXrpRomi(): boolean {
  const romi = document.getElementById('romiCB') as HTMLInputElement;
  const xrp = document.getElementById('xrpCB') as HTMLInputElement;
  const error = document.getElementById('xrpRomiError') as HTMLElement;
  
  // Both can't be checked at the same time
  if (romi.checked && xrp.checked) {
    romi.classList.add('error');
    xrp.classList.add('error');
    if (error) {
      error.style.display = 'block';
    }
    return false;
  } else {
    romi.classList.remove('error');
    xrp.classList.remove('error');
    if (error) {
      error.style.display = 'none';
    }
    return true;
  }
}

export function validateTeamNumber(): boolean {
  const teamNumber = document.getElementById('teamNumber') as HTMLInputElement;
  const error = document.getElementById('teamNumberError') as HTMLElement;
  
  if (teamNumber.value.trim() === '') {
    // Empty is valid (optional)
    teamNumber.classList.remove('error');
    if (error) {
      error.style.display = 'none';
    }
    return true;
  }
  
  const num = Number.parseInt(teamNumber.value, 10);
  if (Number.isNaN(num) || num < 1 || num > 9999) {
    teamNumber.classList.add('error');
    if (error) {
      error.style.display = 'block';
    }
    return false;
  } else {
    teamNumber.classList.remove('error');
    if (error) {
      error.style.display = 'none';
    }
    return true;
  }
}
