'use strict';

/*
  BEGINNER SYNTAX GUIDE
  const declares a binding that cannot be reassigned; its array/object contents can change.
  let declares a variable that may be reassigned as the user works.
  function name(parameters) { ... } defines reusable logic; name(arguments) calls it.
  (parameters) => expression is an arrow function that returns the expression.
  An arrow function with { ... } needs an explicit return to return a value.
  return sends a result back and stops that function call.
  if checks a condition; === compares values without type conversion.
  && means AND, || chooses the first truthy value, and ! means NOT.
  condition ? yes : no chooses one of two expressions (the ternary operator).
  ?. safely accesses/calls a value when its left side is not null or undefined.
  ?? supplies a fallback for null or undefined, but keeps 0, false and empty text.
  ... spreads values into an array/object; it is not omitted source code.
  map transforms array items; filter selects items; find returns one match.
  some checks if any item matches; every checks if all items match.
  Backticks allow HTML template strings with ${expression} placeholders.
  document is the HTML page. querySelector finds an element using CSS selectors.
  User-entered text must pass through e() before inclusion in an HTML string.
  Event handlers run when a user clicks, types, changes a field or submits a form.
  This file stores data locally in this browser; there is no server or shared database.
*/

// ---------- Shared helpers and icons ----------

// $: Finds the first HTML element matching a CSS selector. root = document is a default argument: search the whole page unless another element is supplied.
const $ = (selector, root = document) => root.querySelector(selector); 

// $$: Finds all matching HTML elements. The spread operator (...) converts the NodeList into an array so array methods can be used.
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// escapeHTML: Converts special characters in user text into safe HTML entities. ?? uses an empty string only for null/undefined; replace() applies the lookup to each match in the regular expression.
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

// e: A shorter name for escapeHTML. It references the same function; parentheses are used later to call it.
const e = escapeHTML;

// departments: An array of allowed department names. Arrays use square brackets and are indexed starting at 0.
const departments = ['General Medicine','Pediatrics','Cardiology','Orthopedics','Neurology'];

// weekdays: Weekday names in the order used by Date.getDay(): Sunday = 0 and Saturday = 6.
const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// statuses: The appointment statuses used by forms, filters, badges and reports.
const statuses = ['Scheduled','Confirmed','Completed','Cancelled'];

// months: Month names for reports. Date.getMonth() starts at 0, so January is the first entry.
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// iconPaths: An object that maps icon names to SVG drawing instructions. SVG paths draw icons in the browser without downloading image files.
const iconPaths = {
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  patients: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v3M17 4a4 4 0 0 1 0 7M22 21v-3a5 5 0 0 0-3-4"/>',
  appointments: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 11h18M8 3v4M16 3v4M8 16h2M14 16h2"/>',
  doctors: '<path d="M4 3v6a5 5 0 0 0 10 0V3M9 14v3a4 4 0 0 0 8 0v-3"/><circle cx="17" cy="11" r="3"/>',
  reports: '<path d="M14 3H5v18h14V8ZM14 3v5h5M8 17v-3M12 17v-6M16 17v-2"/>',
  search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="m15 4 5 5M4 20l1-5L17 3l4 4L9 19Z"/>',
  archive: '<path d="M4 8v13h16V8M2 3h20v5H2ZM9 12h6"/>',
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2"/>',
  password: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
  logout: '<path d="M9 3H3v18h6M9 12h12m-5-5 5 5-5 5"/>',
  plus: '<path d="M12 4v16M4 12h16"/>',
  close: '<path d="m5 5 14 14M5 19 19 5"/>',
  menu: '<path d="M3 5h18M3 12h18M3 19h18"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  print: '<path d="M6 9V3h12v6M6 18H3V9h18v9h-3M6 14h12v7H6Z"/>'
};

// icon: Returns SVG markup for an icon. Backticks create a template literal; ${...} inserts an expression. || selects the fallback when the requested path is missing.
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.reports}</svg>`;

// button: Builds a text button, optionally with an icon. data-action names its JavaScript action and data-id identifies its record. Default arguments make optional values empty.
const button = (label, action, id = '', kind = '', glyph = '') => `<button type="button" class="button ${kind}" data-action="${action}" data-id="${e(id)}">${glyph ? icon(glyph) : ''}${e(label)}</button>`;

// actionButton: Builds a compact icon button for a table row. title supplies a hover label; aria-label supplies an accessible name. The ternary expression chooses a danger style for Archive.
const actionButton = (label, action, id, glyph) => `<button type="button" class="icon-button ${glyph === 'archive' ? 'destructive' : ''}" title="${e(label)}" aria-label="${e(label)}" data-action="${action}" data-id="${e(id)}">${icon(glyph)}</button>`;

// badge: Returns a status label. toLowerCase() creates the CSS class name while the visible text keeps its original capitalization.
const badge = status => `<span class="badge ${e(status.toLowerCase())}">${e(status)}</span>`;

// initials: Creates up to two initials. trim removes edge spaces; split separates words; map takes each first character; slice keeps two; join combines them.
const initials = name => name.trim().split(/\s+/).map(part => part[0]).slice(0,2).join('');

// patientName: Builds the full patient name. filter(Boolean) removes empty name parts before join adds spaces. The ternary expression returns a fallback if no patient was found.
const patientName = patient => patient ? [patient.firstName,patient.middleName,patient.lastName].filter(Boolean).join(' ') : 'Unknown patient';

// person: Builds a name with an initials avatar and optional smaller detail text. User-provided strings pass through e() before insertion into HTML.
const person = (name, detail = '') => `<div class="person"><span class="avatar">${e(initials(name))}</span><div><strong>${e(name)}</strong>${detail ? `<small>${e(detail)}</small>` : ''}</div></div>`;

// localDate: Returns a local calendar date as YYYY-MM-DD. new Date() defaults to now. Months need +1 because JavaScript counts from 0; padStart adds leading zeroes.
function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

// today: Arrow function that calls localDate() when needed, so the date is not permanently fixed when the file first loads.
const today = () => localDate();

// tomorrow: Creates a Date for now and increases its day by one. setDate handles month/year rollover. This is the earliest allowed date for a new appointment.
const tomorrow = () => { const date = new Date(); date.setDate(date.getDate()+1); return localDate(date); };

// parseDate: Converts a date string into a local Date at noon. Using an explicit local time avoids interpreting a date-only string as midnight UTC.
const parseDate = value => new Date(`${value}T12:00:00`);

// formatDate: Formats a stored date for display, such as 30 Sep 2026. The options object selects the visible date parts; an empty value displays a dash.
const formatDate = value => value ? parseDate(value).toLocaleDateString('en-PH',{day:'numeric',month:'short',year:'numeric'}) : '—';

// minutes: Converts HH:MM into total minutes after midnight. slice extracts hours/minutes and Number converts numeric text into numbers.
const minutes = time => Number(time.slice(0,2))*60 + Number(time.slice(3));

// timeText: Formats HH:MM into a readable local time. The fixed date is only a formatting helper; it is not the appointment date.
const timeText = time => time ? new Date(`2000-01-01T${time}`).toLocaleTimeString('en-PH',{hour:'numeric',minute:'2-digit'}) : '—';

// calculateAge: Subtracts birth year from the current year, then subtracts one if the birthday has not happened yet. Returns the age in complete years.
function calculateAge(birthDate) {
  const now = new Date(), birth = parseDate(birthDate);
  let years = now.getFullYear()-birth.getFullYear();
  // Compare month/day to avoid counting a birthday that has not happened yet.
  if (now.getMonth()<birth.getMonth() || (now.getMonth()===birth.getMonth() && now.getDate()<birth.getDate())) years--;
  return years;
}

// selectOptions: Builds option elements for a dropdown. Each item may be a plain value or [value, label]. Destructuring unpacks the pair; map builds strings and join combines them.
function selectOptions(values, selected = '', placeholder = '') {
  return (placeholder ? `<option value="">${e(placeholder)}</option>` : '') + values.map(item => {
    const [value,label] = Array.isArray(item) ? item : [item,item];
    return `<option value="${e(value)}" ${String(value)===String(selected) ? 'selected' : ''}>${e(label)}</option>`;
  }).join('');
}

// field: Builds a labeled input and an error message container. type determines the input kind, required makes it mandatory, and extra adds trusted HTML attributes.
function field(label, name, value = '', type = 'text', required = false, extra = '') {
  return `<label><span class="field-label">${e(label)}${required ? ' *' : ''}</span><input name="${name}" type="${type}" value="${e(value)}" ${required ? 'required' : ''} ${extra} aria-describedby="error-${name}"><small class="field-error" id="error-${name}"></small></label>`;
}

// selectField: Builds a labeled dropdown and its error container. selectOptions supplies the options and selects the saved value during editing.
function selectField(label, name, values, value = '', required = false, placeholder = '') {
  return `<label><span class="field-label">${e(label)}${required ? ' *' : ''}</span><select name="${name}" ${required ? 'required' : ''} aria-describedby="error-${name}">${selectOptions(values,value,placeholder)}</select><small class="field-error" id="error-${name}"></small></label>`;
}

// textField: Builds a multiline text area with a 2000-character limit. Escaping the existing value prevents saved text from being treated as HTML.
function textField(label, name, value = '', required = false) {
  return `<label class="full"><span class="field-label">${e(label)}${required ? ' *' : ''}</span><textarea name="${name}" maxlength="2000" ${required ? 'required' : ''} aria-describedby="error-${name}">${e(value)}</textarea><small class="field-error" id="error-${name}"></small></label>`;
}

// passwordField: Builds a password input with a show/hide button. autocomplete tells the browser whether this is an existing or new password.
function passwordField(label, name) {
  return `<label><span class="field-label">${e(label)} *</span><span class="password-box"><input type="password" name="${name}" required autocomplete="${name==='password'||name==='currentPassword' ? 'current-password' : 'new-password'}" aria-describedby="error-${name}"><button type="button" class="icon-button" data-action="toggle-password" aria-label="Show password">${icon('eye')}</button></span><small class="field-error" id="error-${name}"></small></label>`;
}

// formEnd: Closes the form grid and adds an error region, Cancel button and submit button. type="submit" triggers the form submit handler.
const formEnd = label => `</div><p class="form-error" role="alert"></p><div class="form-actions">${button('Cancel','close','','secondary')}<button type="submit" class="button">${label}</button></div></form>`;

// formStart: Shared opening markup for editor forms. novalidate prevents automatic browser submission validation UI; bindForm checks validity and displays inline errors instead.
const formStart = '<form id="editor-form" novalidate><p class="form-note">Fields marked * are required.</p><div class="form-grid">';

// table: Creates a table from header names and arrays of cells. Nested map calls build rows and cells. If rows is empty, one cell spans all columns and shows the empty state.
function table(headers, rows, message = 'No records found.', hint = 'Try another search or filter.') {
  return `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${headers.length}"><div class="empty">${icon('search')}<strong>${e(message)}</strong>${e(hint)}</div></td></tr>`}</tbody></table></div>`;
}

// heading: Builds a page title, subtitle and optional main action button. It returns markup rather than directly changing the page.
const heading = (title, subtitle, action = '') => `<div class="page-heading"><div><h1>${e(title)}</h1><p>${e(subtitle)}</p></div>${action}</div>`;

// searchField: Builds a labeled search box. The search icon is decorative; CSS positions it beside the text with enough input padding.
const searchField = placeholder => `<label class="search"><span class="field-label">Search</span><span class="search-box">${icon('search')}<input name="search" type="search" placeholder="${e(placeholder)}"></span></label>`;

// stat: Builds a dashboard/report count card. Its numeric value is supplied by the caller after counting stored records.
const stat = (label,value,glyph,note) => `<div class="stat"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon(glyph)}</span></div><strong>${value}</strong><small>${e(note)}</small></div>`;

// ---------- Storage: no clinic records are seeded ----------

// storageKeys: Maps short collection names to their localStorage keys. Keeping names together prevents inconsistent key spelling across the app.
const storageKeys = {users:'metromedUsers',session:'metromedSession',patients:'metromedPatients',doctors:'metromedDoctors',appointments:'metromedAppointments',records:'metromedMedicalRecords'};

// loadData: Reads one collection from localStorage. Missing keys return fallback; JSON.parse converts stored JSON text back into JavaScript data. Invalid JSON throws an error.
function loadData(collection, fallback = []) {
  const value = localStorage.getItem(storageKeys[collection]);
  return value === null ? fallback : JSON.parse(value);
}

// saveData: Saves a collection. localStorage stores strings, so JSON.stringify converts arrays/objects to JSON text. Storage failures throw an error for callers to handle.
function saveData(collection, value) { localStorage.setItem(storageKeys[collection],JSON.stringify(value)); }

// getPatients: Loads every patient, including archived patients. Use activePatients() when only the active list is needed.
const getPatients = () => loadData('patients');

// savePatients: Convenience function that saves the full patient array through saveData().
const savePatients = data => saveData('patients',data);

// getDoctors: Loads every doctor, including removed/inactive doctors needed by old appointments.
function getDoctors() {
  const doctors=loadData('doctors');
  let changed=false;
  for (const doctor of doctors) {
    // Migrate missing statuses and the previous title-case values, without resetting saved choices.
    const status=doctor.status == null ? 'available' : String(doctor.status).toLowerCase();
    if (['available','busy','unavailable'].includes(status) && doctor.status!==status) {
      doctor.status=status;
      changed=true;
    }
  }
  if (changed) saveData('doctors',doctors);
  return doctors;
}

// saveDoctors: Convenience function that saves the full doctor array through saveData().
const saveDoctors = data => saveData('doctors',data);

// getAppointments: Loads the full appointment array, including cancelled appointments.
const getAppointments = () => loadData('appointments');

// saveAppointments: Convenience function that saves the full appointment array through saveData().
const saveAppointments = data => saveData('appointments',data);

// getRecords: Loads all medical records, including archived records.
const getRecords = () => loadData('records');

// getPatient: Uses find() to return the first patient whose id strictly matches the requested id. Returns undefined if there is no match.
const getPatient = id => getPatients().find(p=>p.id===id);

// getDoctor: Uses find() to return the doctor for a stored doctor ID. Removed doctors are still found because they are retained.
const getDoctor = id => getDoctors().find(d=>d.id===id);

// activePatients: Only an explicit false marks a patient archived; legacy records remain active.
const activePatients = () => getPatients().filter(p=>p.isActive!==false);

// activeDoctors: Returns only active doctors. Removed doctors stay stored but do not appear in this result.
const activeDoctors = () => getDoctors().filter(d=>d.isActive);

// initializeStorage: Creates missing collections as empty arrays. Only an empty account collection gets the default admin. Existing saved records and edited accounts are not overwritten.
function initializeStorage() {
  // Loop through the named collections. Only missing storage keys are initialized.
  for (const collection of ['users','patients','doctors','appointments','records']) {
    if (localStorage.getItem(storageKeys[collection]) === null) saveData(collection,[]);
  }
  if (!loadData('users').length) saveData('users',[{id:'USER-00001',fullName:'Admin',username:'admin',email:'admin@metromed.example',password:'admin123',role:'Administrator'}]);
  // Previous metromed.v1 demo keys are deliberately not imported or erased.
}

// nextId: Builds the next record ID. It finds IDs with the same prefix, takes the greatest numeric suffix and adds one. Archived rows still reserve their IDs.
function nextId(collection, prefix) {
  const values = loadData(collection).filter(item=>item.id.startsWith(prefix+'-'));
  const number = Math.max(0,...values.map(item=>Number(item.id.split('-').at(-1)) || 0))+1;
  return `${prefix}-${String(number).padStart(5,'0')}`;
}

// replaceRecord: Adds or updates a record. findIndex returns its array position or -1 when absent; push adds new data, otherwise the existing position is replaced.
function replaceRecord(collection, record) {
  const list = loadData(collection);
  // -1 means not found. An existing record keeps its ID and is updated in the same collection.
  const index = list.findIndex(item=>item.id===record.id);
  if (index<0) list.push(record); else list[index]=record;
  saveData(collection,list);
}
// Shared screen state: null means no selection or user.
// currentPage names the visible section; patientPage starts at 1; dirty tracks unsaved form edits.
let currentUser = null, currentPage = 'dashboard', profilePatient = null, patientPage = 1, dirty = false;
let patientArchiveView = false;

// ---------- Dialogs, validation and notifications ----------

// showToast: Creates a temporary notification. textContent inserts plain text. setTimeout removes the notification after 3800 milliseconds.
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast '+type;
  toast.textContent = message;
  $('#toasts').append(toast);
  setTimeout(()=>toast.remove(),3800);
}

// openModal: Fills and opens the reusable native dialog. innerHTML inserts trusted templates whose user values are escaped. dirty resets because the newly opened form is unchanged.
function openModal(title, markup) {
  if ($('#modal').open) $('#modal').close();
  $('#modal-title').textContent=title;
  $('#modal-content').innerHTML=markup;
  dirty=false;
  $('#modal').showModal();
}

// closeModal: Closes a dialog. If a form has unsaved changes, a confirmation runs first. force=true is used after a successful save or confirmed discard.
function closeModal(force = false) {
  if (dirty && !force) return confirmAction('Discard unsaved changes?','Your changes have not been saved.','Discard',()=>closeModal(true),'Keep editing');
  $('#modal').close();
  dirty=false;
}

// confirmAction: Opens a confirmation dialog and stores the action in a callback. The callback runs only after confirmation, not when this function is first called.
function confirmAction(title, message, label, callback, cancel = 'Cancel') {
  $('#confirm-title').textContent=title;
  $('#confirm-text').textContent=message;
  $('#confirm-no').textContent=cancel;
  $('#confirm-yes').textContent=label;
  $('#confirm-no').onclick=()=>$('#confirm-modal').close();
  // Assigning a function delays the action until the user presses the confirmation button.
  $('#confirm-yes').onclick=()=>{
    try { callback(); $('#confirm-modal').close(); }
    catch { showToast('Unable to save. Browser storage may be full or blocked.','error'); }
  };
  $('#confirm-modal').showModal();
  $('#confirm-no').focus();
}

// showErrors: Displays errors underneath fields and in the form summary. Object.entries provides name/message pairs. ||= remembers only the first field to focus.
function showErrors(form, errors) {
  let first;
  for (const [name,message] of Object.entries(errors)) {
    const input=name==='patientId' ? $('#patient-search',form) : form.elements.namedItem(name);
    const output=$(`#error-${name}`,form);
    if (output) output.textContent=message;
    if (input && input.focus) { input.setAttribute('aria-invalid','true'); first ||= input; }
  }
  $('.form-error',form).textContent=Object.values(errors)[0] || '';
  first?.focus();
}

// bindForm: Connects a form to its save handler. It validates fields, collects FormData, temporarily disables submission, then calls handler(values, form). async/await lets the short loading delay finish first.
function bindForm(form, handler, busyLabel = 'Saving…') {
  // async lets this callback use await. Submitting with Enter or the Save button runs this handler.
  form.onsubmit=async event=>{
    // Stop the browser from navigating away or reloading the page for this form submission.
    event.preventDefault();
    $$('.field-error',form).forEach(node=>node.textContent='');
    $$('[aria-invalid]',form).forEach(node=>node.removeAttribute('aria-invalid'));
    $('.form-error',form).textContent='';
    // Collect all field problems before attempting to save.
    const errors={};
    // Check each form control; checkValidity reads native required/type/min/max/step rules.
    for (const input of $$('input,select,textarea',form)) {
      if (!input.checkValidity()) errors[input.name]=input.validationMessage;
      if (!input.disabled && form.dataset.appointment && input.name==='date' && !validateAppointmentDate(input.value)) errors.date='Appointments must be scheduled at least one day in advance.';
      if (input.required && input.type!=='checkbox' && !input.value.trim()) errors[input.name]='This field is required.';
    }
    if (form.dataset.appointment && !form.elements.patientId.disabled && !getPatient(form.elements.patientId.value)) {
      errors.patientId='Select a patient from the search results.';
    }
    if (Object.keys(errors).length) return showErrors(form,errors);
    // FormData contains named successful controls. Disabled controls are excluded; fromEntries makes a plain object.
    const values=Object.fromEntries(new FormData(form));
    // Trim normal text, but preserve password spaces so the stored password matches what was entered.
    for (const key of Object.keys(values)) if (!/password/i.test(key)) values[key]=values[key].trim();
    // Save the original button caption and prevent duplicate submissions while processing.
    const submit=$('[type=submit]',form), original=submit.textContent;
    submit.disabled=true; submit.textContent=busyLabel;
    // Wait briefly without blocking the browser so the loading label can appear.
    await new Promise(resolve=>setTimeout(resolve,220));
    // try handles the save; catch displays storage errors; finally restores the button even after failure.
    try { handler(values,form); }
    catch { $('.form-error',form).textContent='Unable to save. Browser storage may be full or blocked.'; }
    finally { submit.disabled=false; submit.textContent=original; }
  };
}

// passwordError: Checks password rules and returns a message, or an empty string for success. Regular expressions check for a letter and digit; case-insensitive comparison rejects a password matching the username.
function passwordError(password, username) {
  if (password.length<8 || !/[a-z]/i.test(password) || !/\d/.test(password)) return 'Use at least 8 characters with a letter and a number.';
  if (password.toLowerCase()===username.toLowerCase()) return 'The password must not be the same as your username.';
  return '';
}

// accountErrors: Checks username format and duplicate usernames/emails. excludeId lets an account keep its own values during editing. Returns an object containing any field errors.
function accountErrors(values, excludeId = '') {
  const errors={}, users=loadData('users');
  if (!/^[a-z0-9_.-]{4,50}$/i.test(values.username)) errors.username='Use 4–50 letters, numbers, dots, underscores or hyphens.';
  if (users.some(user=>user.id!==excludeId && user.username.toLowerCase()===values.username.toLowerCase())) errors.username='This username is already taken.';
  if (users.some(user=>user.id!==excludeId && user.email.toLowerCase()===values.email.toLowerCase())) errors.email='This email is already used.';
  return errors;
}

// ---------- Authentication and account profile ----------

// renderAuth: Displays Login, Create Account or Forgot Password according to mode. It shows the authentication area, hides the app and connects the appropriate submission function.
function renderAuth(mode = 'login') {
  $('#app').hidden=true; $('#auth').hidden=false;
  const signup=mode==='signup', reset=mode==='reset';
  $('#auth').innerHTML=`<div class="auth-card"><div class="auth-brand"><span class="logo">M</span><h1>${signup?'Create Account':reset?'Forgot Password':'MetroMed Clinic'}</h1><p>${signup?'Create your clinic account.':reset?'Reset a demo account saved in this browser.':'Clinic Patient Record Management System'}</p></div><form id="auth-form" novalidate>${signup?field('Full Name','fullName','','text',true,'maxlength="120"'):''}${field('Username','username','','text',true,'autocomplete="username" maxlength="50"')}${signup||reset?field('Email','email','','email',true,'maxlength="120"'):''}${passwordField(reset?'New Password':'Password',reset?'newPassword':'password')}${signup||reset?passwordField('Confirm Password','confirmPassword'):''}${!signup&&!reset?'<label class="check"><input name="remember" type="checkbox">Remember Me</label>':''}${reset?'<p class="form-note">This demo checks your saved username and email. No reset email is sent.</p>':''}<p class="form-error" role="alert"></p><button class="button" type="submit">${signup?'Create Account':reset?'Reset Password':'Login'}</button></form><div class="auth-links">${signup||reset?'<a href="#login" data-auth="login">Back to Login</a>':'<a href="#reset" data-auth="reset">Forgot Password</a><a href="#signup" data-auth="signup">Create Account</a>'}</div></div>`;
  bindForm($('#auth-form'),signup?createAccount:reset?resetPassword:login,signup||reset?'Saving…':'Signing in...');
}

// login: Looks up an account with matching credentials. A successful match saves the session, optionally marks this tab, opens the app and displays a toast. This is demo authentication only.
function login(values,form) {
  // find returns one matching account or undefined. === requires an exact password match.
  const user=loadData('users').find(item=>item.username.toLowerCase()===values.username.toLowerCase() && item.password===values.password);
  // Early return prevents the successful-login logic from running with invalid credentials.
  if (!user) return showErrors(form,{username:'Invalid username or password.',password:'Invalid username or password.'});
  // !! converts the checkbox value into true or false.
  const remember=!!values.remember;
  // Without Remember Me, a tab-session marker is also required to restore login.
  if (!remember) sessionStorage.setItem('metromedTabSession',user.id);
  saveData('session',{userId:user.id,remember});
  currentUser=user;
  enterApp();
  showToast('Logged in successfully.');
}

// createAccount: Validates a new account and matching passwords, then saves it with an ID and Administrator role. Returns to Login after success.
function createAccount(values,form) {
  const errors=accountErrors(values);
  const problem=passwordError(values.password,values.username);
  if (problem) errors.password=problem;
  if (values.password!==values.confirmPassword) errors.confirmPassword='Passwords must match.';
  if (Object.keys(errors).length) return showErrors(form,errors);
  replaceRecord('users',{id:nextId('users','USER'),fullName:values.fullName,username:values.username,email:values.email,password:values.password,role:'Administrator'});
  renderAuth();
  showToast('Account created successfully.');
}

// resetPassword: Demo-only password reset using a saved username/email pair. Validates the new password and confirmation, updates the account, then returns to Login. No email is sent.
function resetPassword(values,form) {
  const users=loadData('users');
  const user=users.find(item=>item.username.toLowerCase()===values.username.toLowerCase() && item.email.toLowerCase()===values.email.toLowerCase());
  const errors={};
  if (!user) errors.username='The username and email do not match a saved account.';
  const problem=passwordError(values.newPassword,values.username);
  if (problem) errors.newPassword=problem;
  if (values.newPassword!==values.confirmPassword) errors.confirmPassword='Passwords must match.';
  if (Object.keys(errors).length) return showErrors(form,errors);
  replaceRecord('users',{...user,password:values.newPassword});
  renderAuth(); showToast('Password reset successfully.');
}

// updateUserDisplay: Updates every displayed account name and initials avatar. forEach runs the same operation once for each matching element.
function updateUserDisplay() {
  $$('.user-name').forEach(node=>node.textContent=currentUser.fullName);
  $$('.user-initial').forEach(node=>node.textContent=initials(currentUser.fullName));
}

// enterApp: Hides and clears the login area, displays the application, updates account labels and opens the valid page from the URL hash or defaults to Dashboard.
function enterApp() {
  $('#auth').hidden=true; $('#auth').innerHTML=''; $('#app').hidden=false;
  updateUserDisplay();
  const page=location.hash.slice(1);
  showPage(['dashboard','patients','appointments','doctors','reports'].includes(page)?page:'dashboard');
}

// openProfile: Builds My Profile with the current account details. Role is read-only. bindForm connects Save Changes to saveProfile().
function openProfile() {
  openModal('My Profile',formStart+field('Full Name','fullName',currentUser.fullName,'text',true,'maxlength="120"')+field('Username','username',currentUser.username,'text',true,'maxlength="50"')+field('Email','email',currentUser.email,'email',true,'maxlength="120"')+field('Role','role','Administrator','text',false,'readonly')+formEnd('Save Changes'));
  bindForm($('#editor-form'),saveProfile);
}

// saveProfile: Checks edited username/email values, preserves the other account properties with object spread, saves the account and refreshes displayed account names.
function saveProfile(values,form) {
  const errors=accountErrors(values,currentUser.id);
  if (values.username.toLowerCase()===currentUser.password.toLowerCase()) errors.username='Choose a username different from your password.';
  if (Object.keys(errors).length) return showErrors(form,errors);
  // Copy existing account properties, then overwrite only the editable profile fields.
  const user={...currentUser,fullName:values.fullName,username:values.username,email:values.email};
  replaceRecord('users',user); currentUser=user;
  updateUserDisplay(); closeModal(true); refreshPage(); showToast('Profile updated successfully.');
}

// openPassword: Builds the current/new/confirmation password form and connects it to changePassword().
function openPassword() {
  openModal('Change Password',formStart+passwordField('Current Password','currentPassword')+passwordField('New Password','newPassword')+passwordField('Confirm New Password','confirmPassword')+formEnd('Change Password'));
  bindForm($('#editor-form'),changePassword);
}

// changePassword: Checks the current password against the latest stored account, validates the new password, saves it and updates the signed-in account in memory.
function changePassword(values,form) {
  // find returns one matching account or undefined. === requires an exact password match.
  const user=loadData('users').find(item=>item.id===currentUser.id), errors={};
  if (values.currentPassword!==user.password) errors.currentPassword='Current password is incorrect.';
  const problem=passwordError(values.newPassword,user.username);
  if (problem) errors.newPassword=problem;
  if (values.newPassword!==values.confirmPassword) errors.confirmPassword='Passwords must match.';
  if (Object.keys(errors).length) return showErrors(form,errors);
  const updated={...user,password:values.newPassword};
  replaceRecord('users',updated); currentUser=updated;
  closeModal(true); showToast('Password changed successfully.');
}

// logout: Requests confirmation before removing only the session keys. Patient, doctor, appointment and account collections stay saved.
function logout() {
  confirmAction('Log out?','Are you sure you want to log out?','Logout',()=>{
    localStorage.removeItem(storageKeys.session); sessionStorage.removeItem('metromedTabSession');
    currentUser=null; toggleMenu(false); location.hash='login'; renderAuth();
  },'Stay Logged In');
}

// ---------- Navigation and dashboard ----------

// toggleMenu: Opens/closes the mobile sidebar and its overlay. classList.toggle(name, boolean) explicitly adds or removes a CSS class; aria-expanded reports the state.
function toggleMenu(open) {
  $('#sidebar').classList.toggle('open',open); $('#shade').hidden=!open;
  $('#menu-button').setAttribute('aria-expanded',String(open));
}

// toggleProfile: Shows/hides the profile dropdown and updates its accessibility state. hidden=true hides the menu.
function toggleProfile(open) {
  $('#profile-menu').hidden=!open; $('#profile-button').setAttribute('aria-expanded',String(open));
}

// updateActiveNavigation: Marks the current sidebar link active and sets aria-current="page" so screen readers can identify the selected page.
function updateActiveNavigation() {
  $$('.nav-link').forEach(link=>{
    const active=link.dataset.page===currentPage;
    link.classList.toggle('active',active);
    if (active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  });
}

// showPage: Switches the active page without a full reload. The URL hash remembers the section; profilePatient resets so Patients opens its list.
function showPage(page) {
  if (!currentUser) return;
  currentPage=page; profilePatient=null; patientArchiveView=false; location.hash=page;
  // Only the section whose ID matches the requested page receives the active CSS class.
  $$('.page').forEach(section=>section.classList.toggle('active',section.id===page+'Page'));
  $('#page-title').textContent=page[0].toUpperCase()+page.slice(1);
  updateActiveNavigation(); toggleMenu(false); toggleProfile(false); refreshPage();
}

// refreshPage: Calls the renderer for the current page. The object maps page names to functions; [currentPage]() selects and calls one. A selected patient profile is handled separately.
function refreshPage() {
  if (currentPage==='patients' && profilePatient) return viewPatient(profilePatient);
  ({dashboard:renderDashboard,patients:renderPatients,appointments:renderAppointments,doctors:renderDoctors,reports:renderReports})[currentPage]();
}

// doctorAvailability: Display the saved status. Working days and appointment slots are checked separately when booking.
function doctorAvailability(doctor) {
  return ({available:'Available',busy:'Busy',unavailable:'Unavailable'})[doctor.status] || 'Unknown';
}

// monthlyVisitCounts: Count active medical records by month. Repeat visits count separately;
// appointments are not added, so a booking and its medical record cannot double-count a visit.
function monthlyVisitCounts(year) {
  const counts = Array(12).fill(0); // Twelve zeroes keep months without visits visible.
  getRecords().filter(record => record.isActive && record.date.startsWith(`${year}-`)).forEach(record => {
    const month = Number(record.date.slice(5, 7)) - 1; // Convert 01–12 to array indexes 0–11.
    if (month >= 0 && month < 12) counts[month]++;
  });
  return counts;
}

// visitsBarGraph: Draw scalable SVG bars using the same scale for every value.
// Integer tick spacing avoids duplicated rounded labels when only one visit exists.
function visitsBarGraph(labels, counts) {
  const step = Math.max(1, Math.ceil(Math.max(0, ...counts) / 2)), ceiling = step * 2;
  const grid = [0, 1, 2].map(index => {
    const y = 220 - index * 90;
    return `<line class="visit-grid" x1="48" y1="${y}" x2="760" y2="${y}"/><text class="visit-tick" x="24" y="${y+4}" text-anchor="end">${index*step}</text>`;
  }).join('');
  const slot = 712 / labels.length, width = slot * 0.54;
  const bars = counts.map((count, index) => {
    const x = 48 + index * slot + (slot-width)/2, height = count/ceiling*180;
    return `<g><title>${e(labels[index])}: ${count} visits</title><rect class="visit-bar" x="${x}" y="${220-height}" width="${width}" height="${height}" rx="5"/><text class="visit-tick" x="${x+width/2}" y="248" text-anchor="middle">${e(labels[index])}</text></g>`;
  }).join('');
  const description = labels.map((label,index)=>`${label}: ${counts[index]} visits`).join('; ');
  return `<div class="visits-chart-scroll"><svg class="visits-chart-svg" viewBox="0 0 780 270" role="img" aria-label="${e(description)}">${grid}${bars}</svg></div>`;
}

// monthlyVisitsChart: Dashboard overview of recorded consultations from January through December.
function monthlyVisitsChart(year) {
  return `<section class="visits-chart"><div class="panel-heading"><div><h2>Monthly Patient Visits</h2><p>Recorded consultations throughout ${e(year)}</p></div><span class="chart-year">${e(year)}</span></div>${visitsBarGraph(months.map(month=>month.slice(0,3)),monthlyVisitCounts(year))}<p class="visits-chart-note">Visits are counted from patient medical records.</p></section>`;
}

// reportVisitChart: Group the selected month's records into days 1–7, 8–14 and so on.
// Date(year, month, 0) finds the last day and handles leap years automatically.
function reportVisitChart(year, month, records) {
  const days = new Date(year, month, 0).getDate(), labels = [], counts = [];
  for (let start=1; start<=days; start+=7) {
    const end = Math.min(start+6, days);
    labels.push(`${start}–${end}`);
    counts.push(records.filter(record=>{
      const day=Number(record.date.slice(8,10));
      return day>=start && day<=end;
    }).length);
  }
  return `<section class="visits-chart"><h3>Monthly Patient Visits</h3>${visitsBarGraph(labels,counts)}<p class="visits-chart-note">${records.length} recorded visits · day ranges within the selected month</p></section>`;
}

// renderDashboard: Counts saved patients and appointments plus active rostered doctors, then renders dashboard cards and today's appointment table. No statistics are hard-coded.
function renderDashboard() {
  const appointments=getAppointments(), list=appointments.filter(a=>a.date===today()).sort((a,b)=>a.time.localeCompare(b.time));
  const dutyDoctors=activeDoctors().filter(d=>d.days.includes(parseDate(today()).getDay()) && doctorAvailability(d)!=='Unavailable');
  const onDuty=dutyDoctors.length;
  $('#dashboardPage').innerHTML=heading('Dashboard',`Welcome back, ${currentUser.fullName}. Here's today's clinic overview.`,button('Add Patient','add-patient','','','plus'))+`<div class="stats">${stat('Total Patients',getPatients().length,'patients','Registered patients, including archived')}${stat("Today's Appointments",list.length,'appointments',formatDate(today()))}${stat('Doctors On Duty',onDuty,'doctors',"Active doctors working today")}${stat('Completed Appointments',appointments.filter(a=>a.status==='Completed').length,'check','All recorded appointments')}</div><div class="dashboard-overview"><section class="panel">${monthlyVisitsChart(new Date().getFullYear())}</section><section class="panel duty-panel"><div class="panel-heading"><div><h2>Doctors on duty</h2><p>Your care team today</p></div><a href="#doctors">View All →</a></div><div class="duty-list">${dutyDoctors.length ? dutyDoctors.slice(0,3).map(d=>`<div class="duty-row">${person(d.name,d.department)}${badge(doctorAvailability(d))}</div>`).join('') : '<p class="empty">No doctors on duty today.</p>'}</div></section></div><section class="panel"><div class="panel-heading"><div><h2>Appointments Today</h2><p>${list.length} appointments on the schedule</p></div><a href="#appointments">View All →</a></div>${table(['#','Patient','Doctor','Department','Time','Status'],list.map((a,i)=>[i+1,person(patientName(getPatient(a.patientId))),e(getDoctor(a.doctorId)?.name),e(a.department),timeText(a.time),badge(a.status)]),'No appointments scheduled today.','New appointments can be scheduled starting tomorrow.')}</section>`;
}

// ---------- Patients and medical records ----------

// lastVisit: Finds the latest active medical-record date for a patient. ISO date strings sort chronologically; at(-1) gets the last item. Returns empty text when none exist.
function lastVisit(id) { return getRecords().filter(r=>r.patientId===id && r.isActive).map(r=>r.date).sort().at(-1) || ''; }

// renderPatients: Builds the active-patient list and search input, resets pagination and connects typing to live search.
function renderPatients() {
  patientArchiveView=false;
  patientPage=1;
  $('#patientsPage').innerHTML=heading('Patients','Manage clinic patient information and medical records.','<div class="actions">'+button('Archived Patients','archived-patients','','secondary')+button('Add Patient','add-patient','','','plus')+'</div>')+`<section class="panel"><div class="toolbar">${searchField('Search patient ID, name or contact number')}</div><div id="patient-results"></div></section>`;
  $('input[name=search]',$('#patientsPage')).oninput=()=>{patientPage=1;updatePatientList();}; updatePatientList();
}

// updatePatientList: Filters active patients by ID/name/phone and displays ten per page. Math.ceil calculates page count; slice selects the current page without changing the array.
function updatePatientList() {
  const q=$('input[name=search]',$('#patientsPage')).value.trim().toLowerCase(), all=activePatients();
  const list=all.filter(p=>`${p.id} ${patientName(p)} ${p.contact}`.toLowerCase().includes(q));
  const pages=Math.max(1,Math.ceil(list.length/10)); patientPage=Math.min(patientPage,pages);
  const start=(patientPage-1)*10;
  $('#patient-results').innerHTML=table(['Patient ID','Patient Name','Age','Gender','Contact Number','Last Visit','Status','Action'],list.slice(start,start+10).map(p=>[e(p.id),person(patientName(p)),calculateAge(p.birthDate),e(p.gender),e(p.contact),formatDate(lastVisit(p.id)),badge('Active'),`<div class="actions">${actionButton('View patient','view-patient',p.id,'eye')}${actionButton('Edit patient','edit-patient',p.id,'edit')}${actionButton('Archive patient','archive-patient',p.id,'archive')}</div>`]),all.length?'No records found.':'No patients yet.',all.length?'Try another search.':'Add a patient to begin creating clinic records.')+`<div class="pagination"><span>Showing ${list.length?start+1:0}–${Math.min(start+10,list.length)} of ${list.length} patients</span><div class="row"><button class="button secondary" data-action="previous-patients" ${patientPage===1?'disabled':''}>Previous</button><span>${patientPage} / ${pages}</span><button class="button secondary" data-action="next-patients" ${patientPage===pages?'disabled':''}>Next</button></div></div>`;
}

// openPatientForm: Opens a blank or prefilled patient form depending on id. Birth-date input changes immediately recalculate the read-only Age field.
function openPatientForm(id = '') {
  const p=getPatient(id) || {};
  openModal(id?'Edit Patient':'Add Patient',formStart+`<h3 class="form-section">Personal Information</h3>${field('First Name','firstName',p.firstName,'text',true,'maxlength="60"')}${field('Middle Name','middleName',p.middleName,'text',false,'maxlength="60"')}${field('Last Name','lastName',p.lastName,'text',true,'maxlength="60"')}${field('Birth Date','birthDate',p.birthDate,'date',true,`max="${today()}"`)}${field('Age','age',p.birthDate?calculateAge(p.birthDate):'','text',false,'readonly')}${selectField('Gender','gender',['Male','Female','Other'],p.gender,true,'Select gender')}<h3 class="form-section">Contact Information</h3>${field('Contact Number','contact',p.contact,'tel',true,'maxlength="20"')}${field('Email','email',p.email,'email',false,'maxlength="120"')}${textField('Address','address',p.address,true)}<h3 class="form-section">Emergency Contact</h3>${field('Emergency Contact Name','emergencyName',p.emergencyName)}${field('Relationship','relationship',p.relationship)}${field('Emergency Contact Number','emergencyPhone',p.emergencyPhone,'tel',false,'maxlength="20"')}`+formEnd('Save Patient'));
  const form=$('#editor-form');
  form.elements.birthDate.oninput=()=>form.elements.age.value=form.elements.birthDate.value?calculateAge(form.elements.birthDate.value):'';
  bindForm(form,(values,f)=>savePatient(values,f,id));
}

// savePatient: Validates birth date and phone numbers, excludes the calculated age from stored data, and saves a new or edited patient while preserving registration date and active state.
function savePatient(values,form,id) {
  const errors={};
  if (values.birthDate>today() || calculateAge(values.birthDate)>130) errors.birthDate='Enter a birth date within the past 130 years.';
  for (const key of ['contact','emergencyPhone']) if (values[key] && (!/^[+\d ()-]+$/.test(values[key]) || values[key].replace(/\D/g,'').length<7)) errors[key]='Enter a valid phone number with at least 7 digits.';
  if (Object.keys(errors).length) return showErrors(form,errors);
  const previous=getPatient(id); delete values.age;
  replaceRecord('patients',{...previous,...values,id:id||nextId('patients','PT-'+new Date().getFullYear()),isActive:previous?.isActive ?? true,createdAt:previous?.createdAt || today()});
  closeModal(true); refreshPage(); showToast(id?'Patient information updated.':'Patient saved successfully.');
}

// archivePatient: After confirmation, saves isActive=false. The patient disappears from the active list but remains stored with linked medical records and appointments.
function archivePatient(id) {
  confirmAction('Archive Patient?','This patient will no longer appear in the active patient list.','Archive Patient',()=>{
    const patient=getPatient(id);
    if (!patient || patient.isActive===false) return;
    replaceRecord('patients',{...patient,isActive:false,archivedAt:new Date().toISOString()});
    profilePatient=null; renderPatients(); refreshPatientSummaries(); showToast('Patient archived.');
  });
}

// Archived records remain in the same collection, retaining their IDs and linked consultations.
function renderArchivedPatients() {
  patientArchiveView=true; profilePatient=null;
  const patients=getPatients().filter(p=>p.isActive===false);
  const archivedDate=value=>value && !Number.isNaN(Date.parse(value)) ? new Date(value).toLocaleDateString('en-PH',{day:'numeric',month:'short',year:'numeric'}) : 'Not recorded';
  $('#patientsPage').innerHTML=heading('Archived Patients','View patients that were removed from the active patient list.',button('Back to Patients','active-patients','','secondary'))+`<section class="panel">${table(['Patient ID','Patient Name','Age','Gender','Contact Number','Archived Date','Action'],patients.map(p=>[e(p.id),person(patientName(p)),calculateAge(p.birthDate),e(p.gender),e(p.contact),e(archivedDate(p.archivedAt)),`<div class="actions">${button('View','view-patient',p.id,'secondary','eye')}${button('Restore','restore-patient',p.id)}</div>`]),'No archived patients.','Patients you archive will appear here.')}</section>`;
}

function refreshPatientSummaries() {
  renderDashboard();
  // Retain the report's selected month/year when refreshing existing summaries.
  if ($('#report-form')) generateReport();
  // Appointment search reads activePatients on every keystroke and selection.
}

function restorePatient(id) {
  confirmAction('Restore Patient?','This patient will return to the active patient list.','Restore Patient',()=>{
    const patient=getPatient(id);
    if (!patient || patient.isActive!==false) return;
    replaceRecord('patients',{...patient,isActive:true,archivedAt:null});
    renderArchivedPatients(); refreshPatientSummaries(); showToast('Patient restored successfully.');
  });
}

// viewPatient: Shows the selected patient's details and stores their ID in profilePatient, so medical-record actions use the correct patient.
function viewPatient(id) {
  const p=getPatient(id); profilePatient=id;
  $('#patientsPage').innerHTML=heading(p.isActive===false?'Archived Patient':'Patient Profile','Patient information and consultation history.',button('Back','back-patients','','secondary'))+`<section class="panel"><div class="profile-summary">${person(patientName(p),p.id+' · '+calculateAge(p.birthDate)+' years · '+p.gender)}${p.isActive===false?badge('Archived'):''}${button('Edit Patient','edit-patient',id,'secondary','edit')}</div><dl class="details">${[['Contact Number',p.contact],['Email',p.email||'—'],['Address',p.address],['Emergency Contact',p.emergencyName||'—'],['Relationship',p.relationship||'—'],['Emergency Contact Number',p.emergencyPhone||'—']].map(([label,value])=>`<div><dt>${label}</dt><dd>${e(value)}</dd></div>`).join('')}</dl></section><section class="panel"><div class="panel-heading"><h2>Medical Records</h2>${button('Add Medical Record','add-record',id,'','plus')}</div><div id="record-results"></div></section>`;
  renderMedicalRecords();
}

// renderMedicalRecords: Lists only active records belonging to profilePatient, newest date first. Each row includes View, Edit and Archive actions.
function renderMedicalRecords() {
  const records=getRecords().filter(r=>r.patientId===profilePatient && r.isActive).sort((a,b)=>b.date.localeCompare(a.date));
  $('#record-results').innerHTML=table(['Date','Complaint','Diagnosis','Treatment','Doctor','Action'],records.map(r=>[formatDate(r.date),e(r.complaint),e(r.diagnosis),e(r.treatment),e(getDoctor(r.doctorId)?.name),`<div class="actions">${actionButton('View record','view-record',r.id,'eye')}${actionButton('Edit record','edit-record',r.id,'edit')}${actionButton('Archive record','archive-record',r.id,'archive')}</div>`]),'No medical records available.','Add a medical record after a consultation.');
}

// openRecordForm: Opens a medical-record editor. New records need an active doctor; an existing record may retain its removed doctor so historical information can still be edited.
function openRecordForm(id = '') {
  const r=getRecords().find(item=>item.id===id) || {}, p=getPatient(profilePatient);
  const doctors=activeDoctors();
  if (r.doctorId && !doctors.some(d=>d.id===r.doctorId)) doctors.push(getDoctor(r.doctorId));
  if (!doctors.length) return showToast('Add a doctor before creating a medical record.','warning');
  openModal(id?'Edit Medical Record':'Add Medical Record',formStart+field('Date','date',r.date||today(),'date',true,`min="${p.birthDate}" max="${today()}"`)+selectField('Doctor','doctorId',doctors.map(d=>[d.id,d.name]),r.doctorId,true,'Select doctor')+textField('Complaint','complaint',r.complaint,true)+textField('Diagnosis','diagnosis',r.diagnosis,true)+textField('Treatment','treatment',r.treatment,true)+textField('Notes','notes',r.notes)+formEnd('Save Medical Record'));
  bindForm($('#editor-form'),(values,form)=>{
    if (values.date>today() || values.date<p.birthDate) return showErrors(form,{date:'Use a date between the birth date and today.'});
    replaceRecord('records',{...r,...values,id:id||nextId('records','MR'),patientId:p.id,isActive:true});
    closeModal(true); renderMedicalRecords(); showToast('Medical record saved successfully.');
  });
}

// viewRecord: Displays one medical record in a read-only dialog. Saved text is escaped before entering the HTML template.
function viewRecord(id) {
  const r=getRecords().find(item=>item.id===id);
  openModal('Medical Record',`<dl class="detail-list">${[['Date',formatDate(r.date)],['Complaint',r.complaint],['Diagnosis',r.diagnosis],['Treatment',r.treatment],['Doctor',getDoctor(r.doctorId)?.name],['Notes',r.notes||'—']].map(([label,value])=>`<div><dt>${label}</dt><dd>${e(value)}</dd></div>`).join('')}</dl><div class="form-actions">${button('Close','close','','secondary')}</div>`);
}

// archiveRecord: Marks a medical record inactive after confirmation. It is hidden from the profile list but is not permanently deleted.
function archiveRecord(id) {
  confirmAction('Archive Medical Record?','This record will be retained but hidden from the patient’s medical record list.','Archive Record',()=>{
    replaceRecord('records',{...getRecords().find(r=>r.id===id),isActive:false}); renderMedicalRecords(); showToast('Medical record archived.');
  });
}

// ---------- Doctors and weekly schedules ----------

// renderDoctors: Builds the doctor directory and combined search/department/availability filters, then connects them to updateDoctorList().
function renderDoctors() {
  $('#doctorsPage').innerHTML=heading('Doctors','Manage clinic doctors and their availability.',button('Add Doctor','add-doctor','','','plus'))+`<section class="panel"><div class="toolbar">${searchField('Search doctor name or department')}${selectField('Department','departmentFilter',['All departments',...departments])}${selectField('Availability','availabilityFilter',['All availability','Available','Busy','Unavailable'])}</div><div id="doctor-results"></div></section>`;
  $('.toolbar',$('#doctorsPage')).oninput=updateDoctorList; updateDoctorList();
}

// updateDoctorList: Filters active doctors using all selected conditions. && means every condition must pass; an All filter accepts any value.
function updateDoctorList() {
  const root=$('#doctorsPage'), q=$('input[name=search]',root).value.toLowerCase(), department=$('[name=departmentFilter]',root).value, availability=$('[name=availabilityFilter]',root).value;
  const all=activeDoctors(), list=all.filter(d=>`${d.name} ${d.department}`.toLowerCase().includes(q) && (department==='All departments'||d.department===department) && (availability==='All availability'||doctorAvailability(d)===availability));
  $('#doctor-results').innerHTML=table(['Doctor Name','Department','Available Days','Schedule','Status','Action'],list.map(d=>[person(d.name),e(d.department),d.days.map(day=>weekdays[day].slice(0,3)).join(' · '),timeText(d.start)+' – '+timeText(d.end),badge(doctorAvailability(d)),`<div class="actions">${actionButton('View Schedule','doctor-schedule',d.id,'eye')}${actionButton('Edit doctor','edit-doctor',d.id,'edit')}${actionButton('Remove doctor','remove-doctor',d.id,'archive')}</div>`]),all.length?'No records found.':'No doctors added yet.',all.length?'Try another search or filter.':'Add a doctor to create schedules.');
}

// openDoctorForm: Opens a blank or prefilled doctor editor. Checkboxes allow multiple weekdays; time inputs use 1800-second (30-minute) steps.
function openDoctorForm(id = '') {
  const d=getDoctor(id) || {};
  openModal(id?'Edit Doctor':'Add Doctor',formStart+field('Doctor Name','name',d.name,'text',true,'maxlength="120"')+selectField('Department','department',departments,d.department,true,'Select department')+`<fieldset class="days full" aria-describedby="error-days"><legend>Available Days *</legend>${[1,2,3,4,5,6,0].map(day=>`<label class="check"><input type="checkbox" name="days" value="${day}" ${d.days?.includes(day)?'checked':''}>${weekdays[day]}</label>`).join('')}<small id="error-days" class="field-error full"></small></fieldset>`+field('Start Time','start',d.start||'09:00','time',true,'step="1800"')+field('End Time','end',d.end||'17:00','time',true,'step="1800"')+selectField('Status','status',[['available','Available'],['busy','Busy'],['unavailable','Unavailable']],d.status||'available',true)+formEnd(id?'Save Changes':'Add Doctor'));
  bindForm($('#editor-form'),(values,form)=>saveDoctor(values,form,id));
}

// saveDoctor: Reads the checked weekday numbers, validates hours and checks existing future bookings before saving a doctor. Conflicting schedule changes must be resolved first.
function saveDoctor(values,form,id) {
  // :checked selects only checked boxes; Number converts checkbox text values to weekday numbers.
  const days=$$('input[name=days]:checked',form).map(input=>Number(input.value)), errors={};
  if (!['available','busy','unavailable'].includes(values.status)) errors.status='Choose a valid status.';
  if (!days.length) errors.days='Choose at least one working day.';
  if (minutes(values.end)<=minutes(values.start)) errors.end='End time must be after start time.';
  if (minutes(values.start)%30 || minutes(values.end)%30) errors.start='Use times on the hour or half hour.';
  // Do not silently move a doctor's working hours away from appointments already scheduled.
  const conflicts=getAppointments().filter(a=>a.doctorId===id && a.date>=today() && ['Scheduled','Confirmed'].includes(a.status)).some(a=>!days.includes(parseDate(a.date).getDay()) || minutes(a.time)<minutes(values.start) || minutes(a.time)+30>minutes(values.end));
  if (conflicts) errors.start='Reschedule or cancel existing appointments before changing their working hours.';
  if (Object.keys(errors).length) return showErrors(form,errors);
  replaceRecord('doctors',{id:id||nextId('doctors','DR'),name:values.name,department:values.department,days,start:values.start,end:values.end,status:values.status,isActive:true});
  closeModal(true); renderDoctors(); renderDashboard(); renderAppointments(); showToast(id?'Doctor information updated.':'Doctor added successfully.');
}

// removeDoctor: Sets isActive=false after confirmation. The doctor cannot receive new bookings but old appointments keep referencing the retained doctor record.
function removeDoctor(id) {
  confirmAction('Remove Doctor?','This doctor will no longer be available for new appointments.','Remove Doctor',()=>{
    replaceRecord('doctors',{...getDoctor(id),isActive:false}); renderDoctors(); showToast('Doctor removed from new bookings.');
  });
}

// viewDoctorSchedule: Shows all seven weekdays with working times or Unavailable, plus the doctor's saved status.
function viewDoctorSchedule(id) {
  const d=getDoctor(id);
  openModal('Doctor Schedule',`${person(d.name,d.department)}<p class="form-note">Status: ${e(doctorAvailability(d))}</p><div class="schedule">${[1,2,3,4,5,6,0].map(day=>`<div class="schedule-row"><span>${weekdays[day]}</span><span>${d.days.includes(day)?timeText(d.start)+' – '+timeText(d.end):'Unavailable'}</span></div>`).join('')}<div class="schedule-row"><strong>Today's Availability</strong>${badge(doctorAvailability(d))}</div></div><div class="form-actions">${button('Close','close','','secondary')}</div>`);
}

// ---------- Appointments: advance booking and conflict checks ----------

// validateAppointmentDate: Returns true only when the YYYY-MM-DD date is tomorrow or later. Normalized ISO date strings can be compared in calendar order.
function validateAppointmentDate(date) { return date>=tomorrow(); }

// getAvailableDoctors: Returns active doctors in the selected department except doctors manually marked Unavailable. Busy doctors can still have future bookable times.
function getAvailableDoctors(department) { return activeDoctors().filter(d=>d.department===department && d.status!=='unavailable'); }

// getAvailableTimeSlots: Builds 30-minute start times inside a doctor's working hours. Rejects invalid dates/off days and removes slots already booked by the doctor or patient; excludeId prevents an edited appointment from conflicting with itself.
function getAvailableTimeSlots(doctorId,date,excludeId = '',patientId = '') {
  const d=getDoctor(doctorId);
  if (!d || !d.isActive || d.status==='unavailable' || !validateAppointmentDate(date) || !d.days.includes(parseDate(date).getDay())) return [];
  const slots=[];
  // Start at opening time; add 30 minutes per loop; stop before an appointment would end after closing.
  for (let minute=minutes(d.start);minute+30<=minutes(d.end);minute+=30) {
    const time=`${String(Math.floor(minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}`;
    // some returns true when a non-cancelled appointment occupies this doctor/patient/date/time combination.
    const booked=getAppointments().some(a=>a.id!==excludeId && a.status!=='Cancelled' && a.date===date && a.time===time && (a.doctorId===doctorId || a.patientId===patientId));
    // Keep only unoccupied slots in the array returned to the dropdown.
    if (!booked) slots.push(time);
  }
  return slots;
}

// renderAppointments: Builds the appointment page and connects its search/date/status controls to live filtering.
function renderAppointments() {
  $('#appointmentsPage').innerHTML=heading('Appointments','Manage clinic appointments and schedules.',button('Schedule Appointment','add-appointment','','','plus'))+`<section class="panel"><div class="toolbar">${searchField('Search patient name/ID, appointment ID or doctor')}${field('Date','dateFilter','','date')}${selectField('Status','statusFilter',['All statuses',...statuses])}</div><div id="appointment-results"></div></section>`;
  $('.toolbar',$('#appointmentsPage')).oninput=updateAppointmentList; updateAppointmentList();
}

// updateAppointmentList: Applies appointment search, date and status filters together. Results are sorted by date descending, then time ascending.
function updateAppointmentList() {
  const root=$('#appointmentsPage'), q=$('input[name=search]',root).value.toLowerCase(), date=$('[name=dateFilter]',root).value, status=$('[name=statusFilter]',root).value;
  const all=getAppointments(), list=all.filter(a=>`${a.id} ${a.patientId} ${patientName(getPatient(a.patientId))} ${getDoctor(a.doctorId)?.name}`.toLowerCase().includes(q) && (!date||a.date===date) && (status==='All statuses'||a.status===status)).sort((a,b)=>b.date.localeCompare(a.date)||a.time.localeCompare(b.time));
  $('#appointment-results').innerHTML=table(['Appointment ID','Patient','Doctor','Department','Date','Time','Status','Action'],list.map(a=>[e(a.id),person(patientName(getPatient(a.patientId))),e(getDoctor(a.doctorId)?.name),e(a.department),formatDate(a.date),timeText(a.time),badge(a.status),`<div class="actions">${actionButton('View appointment','view-appointment',a.id,'eye')}${actionButton('Edit appointment','edit-appointment',a.id,'edit')}${['Scheduled','Confirmed'].includes(a.status)?actionButton('Cancel appointment','cancel-appointment',a.id,'close'):''}</div>`]),all.length?'No records found.':'No appointments scheduled.',all.length?'Try another search or filter.':'Add a patient and doctor, then schedule an appointment.');
}

// openAppointmentForm: Builds the booking form in patient/department/doctor/date/time order. Dependent dropdowns update together. Historical bookings lock their original slot but allow appropriate status and note edits.
function patientSearchField(patient) {
  return `<div class="patient-picker full"><label for="patient-search"><span class="field-label">Patient *</span></label><input id="patient-search" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="appointment-patient-results" aria-describedby="error-patientId" autocomplete="off" placeholder="Search by patient name or ID..." value="${e(patient ? patientName(patient) : '')}"><input type="hidden" name="patientId" value="${e(patient?.id || '')}"><div id="appointment-patient-results" class="patient-results" role="listbox" aria-label="Matching patients" hidden></div><small id="patient-result-count" class="patient-result-count" role="status"></small><small class="field-error" id="error-patientId"></small></div>`;
}

/** Keep the selected record ID separate from free text so typing can never select a patient implicitly. */
function bindPatientSearch(form,onChange,historical) {
  const input=$('#patient-search',form), list=$('#appointment-patient-results',form), count=$('#patient-result-count',form);
  const hidden=form.elements.patientId, wrapper=$('.patient-picker',form);
  let matches=[], active=-1;
  const close=()=>{
    list.hidden=true;
    input.setAttribute('aria-expanded','false');
    input.removeAttribute('aria-activedescendant');
    active=-1;
  };
  const highlight=()=>{
    const options=$$('[role=option]',list);
    options.forEach((option,index)=>option.setAttribute('aria-selected',String(index===active)));
    if (options[active]) {
      input.setAttribute('aria-activedescendant',options[active].id);
      options[active].scrollIntoView({block:'nearest'});
    }
  };
  const search=()=>{
    const query=input.value.trim().toLowerCase();
    matches=activePatients().filter(p=>`${patientName(p)} ${p.id}`.toLowerCase().includes(query));
    list.replaceChildren(); active=-1;
    matches.forEach((patient,index)=>{
      const option=document.createElement('div');
      option.id=`patient-option-${index}`;
      option.className='patient-option';
      option.setAttribute('role','option');
      option.setAttribute('aria-selected','false');
      const id=document.createElement('strong'), name=document.createElement('span');
      id.textContent=patient.id; name.textContent=patientName(patient);
      option.append(id,name);
      option.onmousedown=event=>event.preventDefault();
      option.onclick=()=>select(index);
      list.append(option);
    });
    if (!matches.length) {
      const empty=document.createElement('p');
      empty.className='patient-no-match'; empty.textContent='No matching patient found.';
      list.append(empty);
    }
    count.textContent=matches.length ? `${matches.length} matching patients.` : 'No matching patient found.';
    list.hidden=false; input.setAttribute('aria-expanded','true');
    input.removeAttribute('aria-activedescendant');
  };
  const select=index=>{
    const patient=getPatient(matches[index]?.id);
    if (!patient || patient.isActive===false) { hidden.value=''; search(); onChange(); return; }
    hidden.value=patient.id; input.value=patientName(patient);
    input.removeAttribute('aria-invalid'); $('#error-patientId',form).textContent='';
    count.textContent=`Selected ${patient.id}.`;
    close(); input.focus(); onChange();
  };
  input.disabled=historical;
  input.oninput=()=>{ hidden.value=''; search(); onChange(); };
  input.onclick=()=>{ if (list.hidden) search(); };
  input.onkeydown=event=>{
    if (event.key==='Escape' && !list.hidden) { event.preventDefault(); event.stopPropagation(); close(); }
    if (event.key==='ArrowDown' || event.key==='ArrowUp') {
      event.preventDefault(); if (list.hidden) search();
      if (matches.length) active=event.key==='ArrowDown' ? (active+1)%matches.length : (active<0?matches.length-1:(active-1+matches.length)%matches.length);
      highlight();
    }
    if (event.key==='Enter' && !list.hidden) {
      event.preventDefault(); if (active>=0) select(active);
    }
    if (event.key==='Tab') close();
  };
  wrapper.onfocusout=event=>{ if (!wrapper.contains(event.relatedTarget)) close(); };
}

function openAppointmentForm(id = '') {
  const a=getAppointments().find(item=>item.id===id) || {};
  if (!id && (!activePatients().length || !activeDoctors().length)) return showToast('Add an active patient and doctor before scheduling.','warning');
  // Historical appointments may update status/notes but cannot be rebooked for today.
  // A previously booked date before tomorrow is historical here, including today. New bookings still require advance notice.
  const historical=!!id && a.date<tomorrow();
  openModal(id?'Edit Appointment':'Schedule Appointment',formStart+patientSearchField(getPatient(a.patientId))+selectField('Department','department',departments,a.department,true,'Select department')+selectField('Doctor','doctorId',[],a.doctorId,true,'Select doctor')+field('Appointment Date','date',a.date||tomorrow(),'date',true,`min="${tomorrow()}"`)+selectField('Available Time','time',[],a.time,true,'Select available time')+textField('Reason for Visit','reason',a.reason,true)+selectField('Status','status',statuses,a.status||'Scheduled',true)+textField('Notes','notes',a.notes)+`<p id="slot-note" class="form-note full"></p>`+formEnd(id?'Save Changes':'Schedule Appointment'));
  const form=$('#editor-form');
  form.dataset.appointment='true';
  // Nested callback: recompute times whenever the doctor, patient or date changes.
  const refreshSlots=()=>{
    const doctor=getDoctor(form.elements.doctorId.value), date=form.elements.date.value;
    let slots=getAvailableTimeSlots(form.elements.doctorId.value,date,id,form.elements.patientId.value);
    // Preserve an existing appointment's own time while editing its other details.
    const unchanged=id && form.elements.doctorId.value===a.doctorId && date===a.date && form.elements.patientId.value===a.patientId;
    if (unchanged && !slots.includes(a.time)) slots.push(a.time);
    const selected=form.elements.time.value||a.time;
    form.elements.time.innerHTML=selectOptions(slots.sort().map(time=>[time,timeText(time)]),selected,'Select available time');
    $('#slot-note').textContent=historical?'Historical appointment: patient, doctor, date and time are read-only.':!validateAppointmentDate(date)?'Appointments must be scheduled at least one day in advance.':doctor&&!doctor.days.includes(parseDate(date).getDay())?'This doctor is not scheduled on the selected day.':doctor&&!slots.length?'No available times on this date.':'Appointments use 30-minute intervals. Choose a future working day.';
  };
  // Nested callback: changing the department rebuilds the matching doctor list, then refreshes time slots.
  const refreshDoctors=()=>{
    const selected=form.elements.doctorId.value||a.doctorId;
    const list=getAvailableDoctors(form.elements.department.value).filter(d=>d.status!=='busy' || getAvailableTimeSlots(d.id,form.elements.date.value,id,form.elements.patientId.value).length);
    if (id && form.elements.department.value===a.department && !list.some(d=>d.id===a.doctorId)) list.push(getDoctor(a.doctorId));
    form.elements.doctorId.innerHTML=selectOptions(list.map(d=>[d.id,d.name+(!d.isActive?' (removed)':'')]),selected,'Select doctor');
    refreshSlots();
  };
  // Populate dropdowns on opening, then rerun the same logic when the department changes.
  refreshDoctors(); form.elements.department.onchange=refreshDoctors;
  // Each field uses the same refreshSlots callback; the callback runs on a change event.
  form.elements.doctorId.onchange=refreshSlots;
  form.elements.date.onchange=refreshDoctors;
  // Lock historical booking details. Disabled inputs are not included in FormData; saveAppointment merges the originals back in.
  if (historical) ['patientId','department','doctorId','date','time'].forEach(name=>form.elements[name].disabled=true);
  bindPatientSearch(form,refreshDoctors,historical);
  bindForm(form,(values,f)=>saveAppointment(values,f,id,historical));
}

// saveAppointment: Rechecks advance booking, active records, doctor weekday and slot conflicts at submission. Existing historical bookings can keep their original slot; restoring cancelled bookings requires a valid free slot.
function saveAppointment(values,form,id,historical) {
  // Merge submitted fields over the old appointment. This preserves locked historical details.
  const previous=getAppointments().find(a=>a.id===id), data={...previous,...values};
  // every confirms that all four booking identifiers remain unchanged.
  const sameSlot=previous && ['patientId','doctorId','date','time'].every(key=>data[key]===previous[key]);
  // Permit edits to an existing historical appointment without treating them as a new same-day booking.
  const statusOnly=historical && sameSlot && (previous.status!=='Cancelled' || data.status==='Cancelled');
  // Restoring a cancelled appointment must recheck active participants and availability.
  const reopening=previous?.status==='Cancelled' && data.status!=='Cancelled';
  const errors={}, doctor=getDoctor(data.doctorId), patient=getPatient(data.patientId);
  if (!statusOnly && !validateAppointmentDate(data.date)) errors.date='Appointments must be scheduled at least one day in advance.';
  if (!patient || ((!sameSlot || reopening) && patient.isActive===false)) errors.patientId='Select a patient from the search results.';
  if ((!sameSlot || reopening) && (!doctor?.isActive || doctor.status==='unavailable')) errors.doctorId='Choose an active available doctor.';
  if (!sameSlot && doctor && !doctor.days.includes(parseDate(data.date).getDay())) errors.date='This doctor is not scheduled on the selected day.';
  if (!sameSlot && !getAvailableTimeSlots(data.doctorId,data.date,id,data.patientId).includes(data.time)) errors.time='Choose an available time. This slot may already be booked.';
  if (data.status!=='Cancelled' && getAppointments().some(a=>a.id!==id && a.status!=='Cancelled' && a.date===data.date && a.time===data.time && (a.doctorId===data.doctorId || a.patientId===data.patientId))) errors.time='The doctor or patient already has an appointment at this time.';
  if (previous?.status==='Cancelled' && data.status!=='Cancelled' && !getAvailableTimeSlots(data.doctorId,data.date,id,data.patientId).includes(data.time)) errors.time='This cancelled appointment cannot be restored to an unavailable slot.';
  if (Object.keys(errors).length) return showErrors(form,errors);
  replaceRecord('appointments',{...data,id:id||nextId('appointments','AP')});
  closeModal(true); updateAppointmentList(); showToast(id?'Appointment updated successfully.':'Appointment scheduled successfully.');
}

// viewAppointment: Displays the appointment's patient, doctor, schedule, status, reason and notes in a read-only dialog.
function viewAppointment(id) {
  const a=getAppointments().find(item=>item.id===id);
  openModal('Appointment '+a.id,`<dl class="detail-list">${[['Patient',patientName(getPatient(a.patientId))],['Doctor',getDoctor(a.doctorId)?.name],['Department',a.department],['Date',formatDate(a.date)],['Time',timeText(a.time)],['Status',a.status],['Reason for Visit',a.reason],['Notes',a.notes||'—']].map(([label,value])=>`<div><dt>${label}</dt><dd>${e(value)}</dd></div>`).join('')}</dl><div class="form-actions">${button('Close','close','','secondary')}</div>`);
}

// cancelAppointment: Saves Cancelled status after confirmation. The record remains visible; the slot becomes available because slot checks ignore cancelled appointments.
function cancelAppointment(id) {
  confirmAction('Cancel Appointment?','The appointment will remain in the records with a Cancelled status.','Cancel Appointment',()=>{
    replaceRecord('appointments',{...getAppointments().find(a=>a.id===id),status:'Cancelled'}); updateAppointmentList(); showToast('Appointment cancelled.');
  },'Keep Appointment');
}

// ---------- Monthly reports, with no report footer ----------

// renderReports: Creates month/year filters, connects Generate Report, and generates an initial report for the current month. A short delay displays the loading state.
function renderReports() {
  const date=new Date(), year=date.getFullYear();
  // Set removes duplicate years; spreading turns it back into an array; sort places recent years first.
  const years=[...new Set([year-1,year,year+1,...getAppointments().map(a=>Number(a.date.slice(0,4))),...getPatients().map(p=>Number(p.createdAt.slice(0,4)))])].sort((a,b)=>b-a);
  $('#reportsPage').innerHTML=heading('Reports','Generate and print clinic activity reports.')+`<section class="panel no-print"><form id="report-form" class="toolbar">${selectField('Month','month',months.map((name,i)=>[String(i+1).padStart(2,'0'),name]),String(date.getMonth()+1).padStart(2,'0'))}${selectField('Year','year',years,year)}<button type="submit" class="button">Generate Report</button></form></section><div id="report-output"></div>`;
  $('#report-form').onsubmit=async event=>{
    // Stop the browser from navigating away or reloading the page for this form submission.
    event.preventDefault(); const button=$('[type=submit]',event.target);
    button.disabled=true; button.textContent='Generating…';
    // Wait briefly without blocking the browser so the loading label can appear.
    await new Promise(resolve=>setTimeout(resolve,220));
    try { generateReport(); showToast('Report generated successfully.'); }
    finally { button.disabled=false; button.textContent='Generate Report'; }
  };
  generateReport();
}

// generateReport: Selects appointments, registrations and active medical records for the month and calculates report tables. Total Patients counts registrations through month end; Active Doctors is the current active count, not a historical snapshot.
function generateReport() {
  const form=$('#report-form'), prefix=form.elements.year.value+'-'+form.elements.month.value;
  const title=months[Number(form.elements.month.value)-1]+' '+form.elements.year.value;
  const appointments=getAppointments().filter(a=>a.date.startsWith(prefix));
  const patients=getPatients().filter(p=>p.createdAt.slice(0,7)<=prefix);
  const newPatients=patients.filter(p=>p.createdAt.startsWith(prefix));
  const records=getRecords().filter(r=>r.isActive && r.date.startsWith(prefix));
  const completed=appointments.filter(a=>a.status==='Completed').length, cancelled=appointments.filter(a=>a.status==='Cancelled').length;
  // Keep unique doctor IDs for the selected month; retained inactive doctors can still appear in this history.
  const doctorIds=new Set(appointments.map(a=>a.doctorId));
  const doctorRows=getDoctors().filter(d=>d.isActive || doctorIds.has(d.id)).map(d=>[e(d.name),e(d.department),appointments.filter(a=>a.doctorId===d.id).length,appointments.filter(a=>a.doctorId===d.id&&a.status==='Completed').length]);
  // Show the report empty state when no registrations, appointments or active medical records occurred in the month.
  const empty=!appointments.length&&!records.length&&!newPatients.length;
  $('#report-output').innerHTML=`<div class="stats no-print">${stat('Total Patients',patients.length,'patients','Registered by month end')}${stat('Total Appointments',appointments.length,'appointments',title)}${stat('Completed Appointments',completed,'check',title)}${stat('Cancelled Appointments',cancelled,'appointments',title)}</div><article class="panel report"><div class="report-heading"><div class="report-brand"><span class="report-mark" aria-hidden="true">M</span><div><h2>METROMED CLINIC</h2><p>Monthly Clinic Report</p><p>${e(title)}</p></div></div>${button('Print Report','print','','secondary no-print','print')}</div><div class="panel-heading"><h3>Summary</h3></div><div class="report-summary">${[['Total Patients',patients.length],['New Patients',newPatients.length],['Archived Patients',patients.filter(p=>p.isActive===false).length],['Total Appointments',appointments.length],['Completed Appointments',completed],['Cancelled Appointments',cancelled],['Active Doctors',activeDoctors().length]].map(([label,value])=>`<div><span>${label}</span><strong>${value}</strong></div>`).join('')}</div>${empty?'<div class="empty"><strong>No clinic activity was recorded for this period.</strong></div>':''}<div class="report-visuals">${reportVisitChart(Number(form.elements.year.value),Number(form.elements.month.value),records)}<section class="report-status"><h3>Appointment Information</h3><div class="report-status-row"><span>Total Appointments</span><strong>${appointments.length}</strong></div>${['Scheduled','Confirmed','Waiting','Completed','Cancelled'].map(status=>`<div class="report-status-row">${badge(status)}<strong>${appointments.filter(a=>a.status===status).length}</strong></div>`).join('')}</section></div><div class="panel-heading"><h3>Doctor Activity</h3></div>${table(['Doctor','Department','Appointments','Completed'],doctorRows,'No doctor activity for this period.','')}</article>`;
}

// ---------- Application events ----------

// initializeApp: Runs once after the HTML is parsed. Initializes storage, inserts navigation/icons, connects UI events and restores a permitted session or displays Login.
function initializeApp() {
  try { initializeStorage(); }
  catch { $('#auth').innerHTML='<div class="auth-card"><h1>Browser storage unavailable</h1><p>Allow local storage and reopen the file. Existing data was not reset.</p></div>'; return; }
  $('#navigation').innerHTML=['dashboard','patients','appointments','doctors','reports'].map(page=>`<a class="nav-link" href="#${page}" data-page="${page}">${icon(page)}${page[0].toUpperCase()+page.slice(1)}</a>`).join('');
  $('#menu-button').innerHTML=icon('menu');
  $('.logout-button').innerHTML=icon('logout')+'Log out';
  $$('#profile-menu button').forEach(button=>button.innerHTML=icon(button.dataset.action)+button.textContent);
  // Clicking the hamburger toggles whether the mobile sidebar is open.
  $('#menu-button').onclick=()=>toggleMenu(!$('#sidebar').classList.contains('open'));
  // Clicking the dark sidebar overlay closes mobile navigation.
  $('#shade').onclick=()=>toggleMenu(false);
  // Clicking the profile button switches the dropdown between hidden and visible.
  $('#profile-button').onclick=()=>toggleProfile($('#profile-menu').hidden);
  // Typing marks the editor as changed so closing it can warn about unsaved data.
  $('#modal-content').oninput=()=>dirty=true;
  // Dropdown and checkbox changes also mark the editor as changed.
  $('#modal-content').onchange=()=>dirty=true;
  // Native dialogs emit cancel on Escape. Prevent automatic closing so dirty-form confirmation can run.
  $('#modal').addEventListener('cancel',event=>{event.preventDefault();closeModal();});
  // Handle clicks outside the dialog rectangle. Clicking inside content must not accidentally close it.
  for (const id of ['modal','confirm-modal']) $('#'+id).addEventListener('click',event=>{
    if (event.target!==event.currentTarget) return;
    const rect=event.currentTarget.getBoundingClientRect();
    if (event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom) {
      if (id==='modal') closeModal(); else event.currentTarget.close();
    }
  });
  // Keyboard listener: Escape closes the profile dropdown and, when safe, the mobile menu.
  document.addEventListener('keydown',event=>{
    if (event.key==='Escape') { toggleProfile(false); if (!$('#modal').open&&!$('#confirm-modal').open) toggleMenu(false); }
  });
  // Event delegation: one page-level click listener handles buttons added later by render functions.
  document.addEventListener('click',event=>{
    // closest walks from the clicked element up through its parents. A click outside the profile area dismisses the dropdown.
    if (!event.target.closest('.profile-area')) toggleProfile(false);
    // Find a sidebar link even when its nested SVG/text was clicked.
    const nav=event.target.closest('[data-page]');
    if (nav && currentUser) { event.preventDefault(); showPage(nav.dataset.page); return; }
    // Authentication links switch between login, registration and reset forms without a page reload.
    const auth=event.target.closest('[data-auth]');
    if (auth) { event.preventDefault(); renderAuth(auth.dataset.auth); return; }
    // Find the nearest button with a data-action attribute; dataset reads those custom HTML attributes.
    const target=event.target.closest('[data-action]');
    if (!target) return;
    const id=target.dataset.id, action=target.dataset.action;
    // Switch input.type between password (masked) and text (visible); update the accessible button label too.
    if (action==='toggle-password') {
      const input=target.previousElementSibling; input.type=input.type==='password'?'text':'password';
      target.setAttribute('aria-label',input.type==='password'?'Show password':'Hide password'); return;
    }
    if (action==='close') return closeModal();
    // Ignore authenticated-app actions while logged out. This is a demo UI guard, not server-side security.
    if (!currentUser) return;
    toggleProfile(false);
    // Map action names to callbacks. Arrow callbacks pass the clicked row's ID into the correct function.
    const handlers={
      profile:openProfile,password:openPassword,logout,
      'add-patient':()=>openPatientForm(),'edit-patient':()=>openPatientForm(id),'archive-patient':()=>archivePatient(id),'view-patient':()=>viewPatient(id),
      'archived-patients':renderArchivedPatients,'active-patients':()=>{profilePatient=null;renderPatients();},'restore-patient':()=>restorePatient(id),'back-patients':()=>{profilePatient=null;patientArchiveView?renderArchivedPatients():renderPatients();},'previous-patients':()=>{patientPage--;updatePatientList();},'next-patients':()=>{patientPage++;updatePatientList();},
      'add-record':()=>openRecordForm(),'edit-record':()=>openRecordForm(id),'view-record':()=>viewRecord(id),'archive-record':()=>archiveRecord(id),
      'add-doctor':()=>openDoctorForm(),'edit-doctor':()=>openDoctorForm(id),'remove-doctor':()=>removeDoctor(id),'doctor-schedule':()=>viewDoctorSchedule(id),
      'add-appointment':()=>openAppointmentForm(),'edit-appointment':()=>openAppointmentForm(id),'view-appointment':()=>viewAppointment(id),'cancel-appointment':()=>cancelAppointment(id),
      print:()=>window.print()
    };
    // try handles the save; catch displays storage errors; finally restores the button even after failure.
    // Optional function call: run the known handler if it exists. Display an error toast if it throws.
    try { handlers[action]?.(); } catch { showToast('Unable to open this action. Reload and try again.','error'); }
  });
  // Handle URL changes such as #patients, including browser Back/Forward navigation.
  window.addEventListener('hashchange',()=>{
    const page=location.hash.slice(1);
    if (currentUser && ['dashboard','patients','appointments','doctors','reports'].includes(page)) showPage(page);
  });
  try {
    // Restore login only for Remember Me or a matching tab-session marker, and only if the account still exists.
    const session=loadData('session',null);
    if (session && (session.remember||sessionStorage.getItem('metromedTabSession')===session.userId)) currentUser=loadData('users').find(user=>user.id===session.userId)||null;
  } catch { currentUser=null; }
  // Choose the initial view based on whether a valid demo session was restored.
  if (currentUser) enterApp(); else renderAuth();
}
// Call the startup function once. The HTML script uses defer, so the page elements exist first.
initializeApp();
