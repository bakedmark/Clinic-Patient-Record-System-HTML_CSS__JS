'use strict';

const $ = (selector, root = document) => root.querySelector(selector);

const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const escapeHTML = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g, // match characters that need to be escaped
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ // map each character to its corresponding HTML entity
        char
      ],
  );

const e = escapeHTML;

const departments = [
  'General Medicine',
  'Pediatrics',
  'Obstetrics and Gynecology',
  'Radiology',
  'Internal Medicine',
  'Cardiology',
  'Orthopedics'
];

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const statuses = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const iconPaths = {
  dashboard:
    '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  patients:
    '<circle cx="9" cy="7" r="4"/><path d="M2 21v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v3M17 4a4 4 0 0 1 0 7M22 21v-3a5 5 0 0 0-3-4"/>',
  appointments:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 11h18M8 3v4M16 3v4M8 16h2M14 16h2"/>',
  doctors:
    '<path d="M4 3v6a5 5 0 0 0 10 0V3M9 14v3a4 4 0 0 0 8 0v-3"/><circle cx="17" cy="11" r="3"/>',
  reports: '<path d="M14 3H5v18h14V8ZM14 3v5h5M8 17v-3M12 17v-6M16 17v-2"/>',
  search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="m15 4 5 5M4 20l1-5L17 3l4 4L9 19Z"/>',
  archive: '<path d="M4 8v13h16V8M2 3h20v5H2ZM9 12h6"/>',
  profile:
    '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2"/>',
  password:
    '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
  logout: '<path d="M9 3H3v18h6M9 12h12m-5-5 5 5-5 5"/>',
  plus: '<path d="M12 4v16M4 12h16"/>',
  close: '<path d="m5 5 14 14M5 19 19 5"/>',
  menu: '<path d="M3 5h18M3 12h18M3 19h18"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  print: '<path d="M6 9V3h12v6M6 18H3V9h18v9h-3M6 14h12v7H6Z"/>',
};

const icon = (name) =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.reports}</svg>`;

const button = (label, action, id = '', kind = '', glyph = '') =>
  `<button type="button" class="button ${kind}" data-action="${action}" data-id="${e(id)}">${glyph ? icon(glyph) : ''}${e(label)}</button>`;

const actionButton = (label, action, id, glyph) =>
  `<button type="button" class="icon-button ${glyph === 'archive' ? 'destructive' : ''}" title="${e(label)}" aria-label="${e(label)}" data-action="${action}" data-id="${e(id)}">${icon(glyph)}</button>`;

const badge = (status) =>
  `<span class="badge ${e(status.toLowerCase())}">${e(status)}</span>`;

const initials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

const patientName = (patient) =>
  patient
    ? [patient.firstName, patient.middleName, patient.lastName]
        .filter(Boolean)
        .join(' ')
    : 'Unknown patient';

const person = (name, detail = '') =>
  `<div class="person"><span class="avatar">${e(initials(name))}</span><div><strong>${e(name)}</strong>${detail ? `<small>${e(detail)}</small>` : ''}</div></div>`;

function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const today = () => localDate();

const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return localDate(date);
};

const parseDate = (value) => new Date(`${value}T12:00:00`);   // parse date string in YYYY-MM-DD format to Date object

const formatDate = (value) =>
  value
    ? parseDate(value).toLocaleDateString('en-PH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }) 
    : '—'; 

const minutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));

const timeText = (time) =>
  time
    ? new Date(`2000-01-01T${time}`).toLocaleTimeString('en-PH', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : '—';

function calculateAge(birthDate) {
  const now = new Date(),
    birth = parseDate(birthDate);
  let years = now.getFullYear() - birth.getFullYear();

  if (
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  )
    years--;
  return years;
}

function selectOptions(values, selected = '', placeholder = '') {
  return (
    (placeholder ? `<option value="">${e(placeholder)}</option>` : '') +
    values
      .map((item) => {
        const [value, label] = Array.isArray(item) ? item : [item, item];
        return `<option value="${e(value)}" ${String(value) === String(selected) ? 'selected' : ''}>${e(label)}</option>`;
      })
      .join('')
  );
}

function field(
  label,
  name,
  value = '',
  type = 'text',
  required = false,
  extra = '',
) {
  return `<label><span class="field-label">${e(label)}${required ? ' *' : ''}</span><input name="${name}" type="${type}" value="${e(value)}" ${required ? 'required' : ''} ${extra} aria-describedby="error-${name}"><small class="field-error" id="error-${name}"></small></label>`;
}

function selectField(
  label,
  name,
  values,
  value = '',
  required = false,
  placeholder = '',
) {
  return `<label><span class="field-label">${e(label)}${required ? ' *' : ''}</span><select name="${name}" ${required ? 'required' : ''} aria-describedby="error-${name}">${selectOptions(values, value, placeholder)}</select><small class="field-error" id="error-${name}"></small></label>`;
}

function textField(label, name, value = '', required = false) {
  return `<label class="full"><span class="field-label">${e(label)}${required ? ' *' : ''}</span><textarea name="${name}" maxlength="2000" ${required ? 'required' : ''} aria-describedby="error-${name}">${e(value)}</textarea><small class="field-error" id="error-${name}"></small></label>`;
}

function passwordField(label, name) {
  return `<label><span class="field-label">${e(label)} *</span><span class="password-box"><input type="password" name="${name}" required autocomplete="${name === 'password' || name === 'currentPassword' ? 'current-password' : 'new-password'}" aria-describedby="error-${name}"><button type="button" class="icon-button" data-action="toggle-password" aria-label="Show password">${icon('eye')}</button></span><small class="field-error" id="error-${name}"></small></label>`;
}

const formEnd = (label) =>
  `</div><p class="form-error" role="alert"></p><div class="form-actions">${button('Cancel', 'close', '', 'secondary')}<button type="submit" class="button">${label}</button></div></form>`;

const formStart =
  '<form id="editor-form" novalidate><p class="form-note">Fields marked * are required.</p><div class="form-grid">';

function table(
  headers,
  rows,
  message = 'No records found.',
  hint = 'Try another search or filter.',
) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${headers.length}"><div class="empty">${icon('search')}<strong>${e(message)}</strong>${e(hint)}</div></td></tr>`}</tbody></table></div>`;
}

const heading = (title, subtitle, action = '') =>
  `<div class="page-heading"><div><h1>${e(title)}</h1><p>${e(subtitle)}</p></div>${action}</div>`;

const searchField = (placeholder) =>
  `<label class="search"><span class="field-label">Search</span><span class="search-box">${icon('search')}<input name="search" type="search" placeholder="${e(placeholder)}"></span></label>`;

const stat = (label, value, glyph, note) =>
  `<div class="stat"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon(glyph)}</span></div><strong>${value}</strong><small>${e(note)}</small></div>`;

const storageKeys = {
  users: 'metromedUsers',
  session: 'metromedSession',
  patients: 'metromedPatients',
  doctors: 'metromedDoctors',
  appointments: 'metromedAppointments',
  records: 'metromedMedicalRecords',
};

function loadData(collection, fallback = []) {
  const value = localStorage.getItem(storageKeys[collection]);
  return value === null ? fallback : JSON.parse(value);
}

function saveData(collection, value) {
  localStorage.setItem(storageKeys[collection], JSON.stringify(value));
}

const getPatients = () => loadData('patients');

const savePatients = (data) => saveData('patients', data);

function getDoctors() {
  const doctors = loadData('doctors');
  let changed = false;
  for (const doctor of doctors) {
    const status =
      doctor.status == null ? 'available' : String(doctor.status).toLowerCase();
    if (
      ['available', 'busy', 'unavailable'].includes(status) &&
      doctor.status !== status
    ) {
      doctor.status = status;
      changed = true;
    }
  }
  if (changed) saveData('doctors', doctors);
  return doctors;
}

const saveDoctors = (data) => saveData('doctors', data);

const getAppointments = () => loadData('appointments');

const saveAppointments = (data) => saveData('appointments', data);

const getRecords = () => loadData('records');

const getPatient = (id) => getPatients().find((p) => p.id === id);

const getDoctor = (id) => getDoctors().find((d) => d.id === id);

const activePatients = () => getPatients().filter((p) => p.isActive !== false);

const activeDoctors = () => getDoctors().filter((d) => d.isActive);

function initializeStorage() {
  for (const collection of [
    'users',
    'patients',
    'doctors',
    'appointments',
    'records',
  ]) {
    if (localStorage.getItem(storageKeys[collection]) === null)
      saveData(collection, []);
  }
  if (!loadData('users').length)
    saveData('users', [
      {
        id: 'USER-00001',
        fullName: 'Admin',
        username: 'admin',
        email: 'admin@metromed.example',
        password: 'admin123',
        role: 'Administrator',
      },
    ]);
}

function nextId(collection, prefix) {
  const values = loadData(collection).filter((item) =>
    item.id.startsWith(prefix + '-'),
  );
  const number =
    Math.max(
      0,
      ...values.map((item) => Number(item.id.split('-').at(-1)) || 0),
    ) + 1;
  return `${prefix}-${String(number).padStart(5, '0')}`;
}

function replaceRecord(collection, record) {
  const list = loadData(collection);

  const index = list.findIndex((item) => item.id === record.id);
  if (index < 0) list.push(record);
  else list[index] = record;
  saveData(collection, list);
}

let currentUser = null,
  currentPage = 'dashboard',
  profilePatient = null,
  patientPage = 1,
  dirty = false;
let patientArchiveView = false;

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = message;
  $('#toasts').append(toast);
  setTimeout(() => toast.remove(), 3800);
}

function openModal(title, markup) {
  if ($('#modal').open) $('#modal').close();
  $('#modal-title').textContent = title;
  $('#modal-content').innerHTML = markup;
  dirty = false;
  $('#modal').showModal();
}

function closeModal(force = false) {
  if (dirty && !force)
    return confirmAction(
      'Discard unsaved changes?',
      'Your changes have not been saved.',
      'Discard',
      () => closeModal(true),
      'Keep editing',
    );
  $('#modal').close();
  dirty = false;
}

function confirmAction(title, message, label, callback, cancel = 'Cancel') {
  $('#confirm-title').textContent = title;
  $('#confirm-text').textContent = message;
  $('#confirm-no').textContent = cancel;
  $('#confirm-yes').textContent = label;
  $('#confirm-no').onclick = () => $('#confirm-modal').close();

  $('#confirm-yes').onclick = () => {
    try {
      callback();
      $('#confirm-modal').close();
    } catch {
      showToast(
        'Unable to save. Browser storage may be full or blocked.',
        'error',
      );
    }
  };
  $('#confirm-modal').showModal();
  $('#confirm-no').focus();
}

function showErrors(form, errors) {
  let first;
  for (const [name, message] of Object.entries(errors)) {
    const input =
      name === 'patientId'
        ? $('#patient-search', form)
        : form.elements.namedItem(name);
    const output = $(`#error-${name}`, form);
    if (output) output.textContent = message;
    if (input && input.focus) {
      input.setAttribute('aria-invalid', 'true');
      first ||= input;
    }
  }
  $('.form-error', form).textContent = Object.values(errors)[0] || '';
  first?.focus();
}

function bindForm(form, handler, busyLabel = 'Saving…') {
  form.onsubmit = async (event) => {
    event.preventDefault();
    $$('.field-error', form).forEach((node) => (node.textContent = ''));
    $$('[aria-invalid]', form).forEach((node) =>
      node.removeAttribute('aria-invalid'),
    );
    $('.form-error', form).textContent = '';

    const errors = {};

    for (const input of $$('input,select,textarea', form)) {
      if (!input.checkValidity()) errors[input.name] = input.validationMessage;
      if (
        !input.disabled &&
        form.dataset.appointment &&
        input.name === 'date' &&
        !validateAppointmentDate(input.value)
      )
        errors.date =
          'Appointments must be scheduled at least one day in advance.';
      if (input.required && input.type !== 'checkbox' && !input.value.trim())
        errors[input.name] = 'This field is required.';
    }
    if (
      form.dataset.appointment &&
      !form.elements.patientId.disabled &&
      !getPatient(form.elements.patientId.value)
    ) {
      errors.patientId = 'Select a patient from the search results.';
    }
    if (Object.keys(errors).length) return showErrors(form, errors);

    const values = Object.fromEntries(new FormData(form));

    for (const key of Object.keys(values))
      if (!/password/i.test(key)) values[key] = values[key].trim();

    const submit = $('[type=submit]', form),
      original = submit.textContent;
    submit.disabled = true;
    submit.textContent = busyLabel;

    await new Promise((resolve) => setTimeout(resolve, 220));

    try {
      handler(values, form); // call the provided handler function with form values and form element
    } catch {
      $('.form-error', form).textContent =
        'Unable to save. Browser storage may be full or blocked.';
    } finally {
      submit.disabled = false;
      submit.textContent = original;
    }
  };
}

function passwordError(password, username) {
  if (password.length < 8 || !/[a-z]/i.test(password) || !/\d/.test(password)) // check for minimum length, at least one letter and one number
    return 'Use at least 8 characters with a letter and a number.';
  if (password.toLowerCase() === username.toLowerCase())
    return 'The password must not be the same as your username.';
  return '';
}

function accountErrors(values, excludeId = '') {
  const errors = {},
    users = loadData('users');
  if (!/^[a-z0-9_.-]{4,50}$/i.test(values.username))
    errors.username =
      'Use 4 to 50 letters, numbers, dots, underscores or hyphens.';
  if (
    users.some(
      (user) =>
        user.id !== excludeId &&
        user.username.toLowerCase() === values.username.toLowerCase(),
    )
  )
    errors.username = 'This username is already taken.';
  if (
    users.some(
      (user) =>
        user.id !== excludeId &&
        user.email.toLowerCase() === values.email.toLowerCase(),
    )
  )
    errors.email = 'This email is already used.';
  return errors;
}

// ---------- Authentication and account profile ----------

function renderAuth(mode = 'login') {
  $('#app').hidden = true;
  $('#auth').hidden = false;
  const signup = mode === 'signup',
    reset = mode === 'reset';
  $('#auth').innerHTML =
    `<div class="auth-card"><div class="auth-brand"><span class="logo">M</span><h1>${signup ? 'Create Account' : reset ? 'Forgot Password' : 'MetroMed Clinic'}</h1><p>${signup ? 'Create your clinic account.' : reset ? 'Enter your username and email to reset your password' : 'Clinic Patient Record Management System'}</p></div><form id="auth-form" novalidate>${signup ? field('Full Name', 'fullName', '', 'text', true, 'maxlength="120"') : ''}${field('Username', 'username', '', 'text', true, 'autocomplete="username" maxlength="50"')}${signup || reset ? field('Email', 'email', '', 'email', true, 'maxlength="120"') : ''}${passwordField(reset ? 'New Password' : 'Password', reset ? 'newPassword' : 'password')}${signup || reset ? passwordField('Confirm Password', 'confirmPassword') : ''}${!signup && !reset ? '<label class="check"><input name="remember" type="checkbox">Remember Me</label>' : ''}${reset ? '<p class="form-note">Changes will be saved locally on this device.</p>' : ''}<p class="form-error" role="alert"></p><button class="button" type="submit">${signup ? 'Create Account' : reset ? 'Reset Password' : 'Login'}</button></form><div class="auth-links">${signup || reset ? '<a href="#login" data-auth="login">Back to Login</a>' : '<a href="#reset" data-auth="reset">Forgot Password</a><a href="#signup" data-auth="signup">Create Account</a>'}</div></div>`;
  bindForm(
    $('#auth-form'),
    signup ? createAccount : reset ? resetPassword : login,
    signup || reset ? 'Saving…' : 'Signing in...',
  );
}

function login(values, form) {
  const user = loadData('users').find(
    (item) =>
      item.username.toLowerCase() === values.username.toLowerCase() &&
      item.password === values.password,
  );

  if (!user)
    return showErrors(form, {
      username: 'Invalid username or password.',
      password: 'Invalid username or password.',
    });

  const remember = !!values.remember;

  if (!remember) sessionStorage.setItem('metromedTabSession', user.id);
  saveData('session', { userId: user.id, remember });
  currentUser = user;
  enterApp();
  showToast('Logged in successfully.');
}

function createAccount(values, form) {
  const errors = accountErrors(values);
  const problem = passwordError(values.password, values.username);
  if (problem) errors.password = problem;
  if (values.password !== values.confirmPassword)
    errors.confirmPassword = 'Passwords must match.';
  if (Object.keys(errors).length) return showErrors(form, errors);
  replaceRecord('users', {
    id: nextId('users', 'USER'),
    fullName: values.fullName,
    username: values.username,
    email: values.email,
    password: values.password,
    role: 'Administrator',
  });
  renderAuth();
  showToast('Account created successfully.');
}

function resetPassword(values, form) {
  const users = loadData('users');
  const user = users.find(
    (item) =>
      item.username.toLowerCase() === values.username.toLowerCase() &&
      item.email.toLowerCase() === values.email.toLowerCase(),
  );
  const errors = {};
  if (!user)
    errors.username = 'The username and email do not match a saved account.';
  const problem = passwordError(values.newPassword, values.username);
  if (problem) errors.newPassword = problem;
  if (values.newPassword !== values.confirmPassword)
    errors.confirmPassword = 'Passwords must match.';
  if (Object.keys(errors).length) return showErrors(form, errors);
  replaceRecord('users', { ...user, password: values.newPassword });
  renderAuth();
  showToast('Password reset successfully.');
}

function updateUserDisplay() {
  $$('.user-name').forEach((node) => (node.textContent = currentUser.fullName));
  $$('.user-initial').forEach(
    (node) => (node.textContent = initials(currentUser.fullName)),
  );
}

function enterApp() {
  $('#auth').hidden = true;
  $('#auth').innerHTML = '';
  $('#app').hidden = false;
  updateUserDisplay();
  const page = location.hash.slice(1);
  showPage(
    ['dashboard', 'patients', 'appointments', 'doctors', 'reports'].includes(
      page,
    )
      ? page
      : 'dashboard',
  );
}

function openProfile() {
  openModal(
    'My Profile',
    formStart +
      field(
        'Full Name',
        'fullName',
        currentUser.fullName,
        'text',
        true,
        'maxlength="120"',
      ) +
      field(
        'Username',
        'username',
        currentUser.username,
        'text',
        true,
        'maxlength="50"',
      ) +
      field(
        'Email',
        'email',
        currentUser.email,
        'email',
        true,
        'maxlength="120"',
      ) +
      field('Role', 'role', 'Administrator', 'text', false, 'readonly') +
      formEnd('Save Changes'),
  );
  bindForm($('#editor-form'), saveProfile);
}

function saveProfile(values, form) {
  const errors = accountErrors(values, currentUser.id);
  if (values.username.toLowerCase() === currentUser.password.toLowerCase())
    errors.username = 'Choose a username different from your password.';
  if (Object.keys(errors).length) return showErrors(form, errors);

  const user = {
    ...currentUser,
    fullName: values.fullName,
    username: values.username,
    email: values.email,
  };
  replaceRecord('users', user);
  currentUser = user;
  updateUserDisplay();
  closeModal(true);
  refreshPage();
  showToast('Profile updated successfully.');
}

function openPassword() {
  openModal(
    'Change Password',
    formStart +
      passwordField('Current Password', 'currentPassword') +
      passwordField('New Password', 'newPassword') +
      passwordField('Confirm New Password', 'confirmPassword') +
      formEnd('Change Password'),
  );
  bindForm($('#editor-form'), changePassword);
}

function changePassword(values, form) {
  const user = loadData('users').find((item) => item.id === currentUser.id),
    errors = {};
  if (values.currentPassword !== user.password)
    errors.currentPassword = 'Current password is incorrect.';
  const problem = passwordError(values.newPassword, user.username);
  if (problem) errors.newPassword = problem;
  if (values.newPassword !== values.confirmPassword)
    errors.confirmPassword = 'Passwords must match.';
  if (Object.keys(errors).length) return showErrors(form, errors);
  const updated = { ...user, password: values.newPassword };
  replaceRecord('users', updated);
  currentUser = updated;
  closeModal(true);
  showToast('Password changed successfully.');
}

function logout() {
  confirmAction(
    'Log out?',
    'Are you sure you want to log out?',
    'Logout',
    () => {
      localStorage.removeItem(storageKeys.session);
      sessionStorage.removeItem('metromedTabSession');
      currentUser = null;
      toggleMenu(false);
      location.hash = 'login';
      renderAuth();
    },
    'Stay Logged In',
  );
}

// ---------- Navigation and dashboard ----------

function toggleMenu(open) {
  $('#sidebar').classList.toggle('open', open);
  $('#shade').hidden = !open;
  $('#menu-button').setAttribute('aria-expanded', String(open));
}

function toggleProfile(open) {
  $('#profile-menu').hidden = !open;
  $('#profile-button').setAttribute('aria-expanded', String(open));
}

function updateActiveNavigation() {
  $$('.nav-link').forEach((link) => {
    const active = link.dataset.page === currentPage;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function showPage(page) {
  if (!currentUser) return;
  currentPage = page;
  profilePatient = null;
  patientArchiveView = false;
  location.hash = page;

  $$('.page').forEach((section) =>
    section.classList.toggle('active', section.id === page + 'Page'),
  );
  $('#page-title').textContent = page[0].toUpperCase() + page.slice(1);
  updateActiveNavigation();
  toggleMenu(false);
  toggleProfile(false);
  refreshPage();
}

function refreshPage() {
  if (currentPage === 'patients' && profilePatient)
    return viewPatient(profilePatient);
  ({
    dashboard: renderDashboard,
    patients: renderPatients,
    appointments: renderAppointments,
    doctors: renderDoctors,
    reports: renderReports,
  })[currentPage]();
}

function doctorAvailability(doctor) {
  return (
    { available: 'Available', busy: 'Busy', unavailable: 'Unavailable' }[
      doctor.status
    ] || 'Unknown'
  );
}

function monthlyVisitCounts(year) {
  const counts = Array(12).fill(0);
  getRecords()
    .filter((record) => record.isActive && record.date.startsWith(`${year}-`))
    .forEach((record) => {
      const month = Number(record.date.slice(5, 7)) - 1;
      if (month >= 0 && month < 12) counts[month]++;
    });
  return counts;
}

function visitsBarGraph(labels, counts) {
  const step = Math.max(1, Math.ceil(Math.max(0, ...counts) / 2)),
    ceiling = step * 2;
  const grid = [0, 1, 2]
    .map((index) => {
      const y = 220 - index * 90;
      return `<line class="visit-grid" x1="48" y1="${y}" x2="760" y2="${y}"/><text class="visit-tick" x="24" y="${y + 4}" text-anchor="end">${index * step}</text>`;
    })
    .join('');
  const slot = 712 / labels.length,
    width = slot * 0.54;
  const bars = counts
    .map((count, index) => {
      const x = 48 + index * slot + (slot - width) / 2,
        height = (count / ceiling) * 180;
      return `<g><title>${e(labels[index])}: ${count} visits</title><rect class="visit-bar" x="${x}" y="${220 - height}" width="${width}" height="${height}" rx="5"/><text class="visit-tick" x="${x + width / 2}" y="248" text-anchor="middle">${e(labels[index])}</text></g>`;
    })
    .join('');
  const description = labels
    .map((label, index) => `${label}: ${counts[index]} visits`)
    .join('; ');
  return `<div class="visits-chart-scroll"><svg class="visits-chart-svg" viewBox="0 0 780 270" role="img" aria-label="${e(description)}">${grid}${bars}</svg></div>`;
}

function monthlyVisitsChart(year) {
  return `<section class="visits-chart"><div class="panel-heading"><div><h2>Monthly Patient Visits</h2><p>Recorded consultations throughout ${e(year)}</p></div><span class="chart-year">${e(year)}</span></div>${visitsBarGraph(
    months.map((month) => month.slice(0, 3)),
    monthlyVisitCounts(year),
  )}<p class="visits-chart-note">Visits are counted from patient medical records.</p></section>`;
}

function reportVisitChart(year, month, records) {
  const days = new Date(year, month, 0).getDate(),
    labels = [],
    counts = [];
  for (let start = 1; start <= days; start += 7) {
    const end = Math.min(start + 6, days);
    labels.push(`${start}–${end}`);
    counts.push(
      records.filter((record) => {
        const day = Number(record.date.slice(8, 10));
        return day >= start && day <= end;
      }).length,
    );
  }
  return `<section class="visits-chart"><h3>Monthly Patient Visits</h3>${visitsBarGraph(labels, counts)}<p class="visits-chart-note">${records.length} recorded visits · day ranges within the selected month</p></section>`;
}

function renderDashboard() {
  const appointments = getAppointments(),
    list = appointments
      .filter((a) => a.date === today())
      .sort((a, b) => a.time.localeCompare(b.time));
  const dutyDoctors = activeDoctors().filter(
    (d) =>
      d.days.includes(parseDate(today()).getDay()) &&
      doctorAvailability(d) !== 'Unavailable',
  );
  const onDuty = dutyDoctors.length;
  $('#dashboardPage').innerHTML =
    heading(
      'Dashboard',
      `Welcome back, ${currentUser.fullName}. Here's today's clinic overview.`,
      button('Add Patient', 'add-patient', '', '', 'plus'),
    ) +
    `<div class="stats">${stat('Total Patients', getPatients().length, 'patients', 'Registered patients, including archived')}${stat("Today's Appointments", list.length, 'appointments', formatDate(today()))}${stat('Doctors On Duty', onDuty, 'doctors', 'Active doctors working today')}${stat('Completed Appointments', appointments.filter((a) => a.status === 'Completed').length, 'check', 'All recorded appointments')}</div><div class="dashboard-overview"><section class="panel">${monthlyVisitsChart(new Date().getFullYear())}</section><section class="panel duty-panel"><div class="panel-heading"><div><h2>Doctors on duty</h2><p>Your care team today</p></div><a href="#doctors">View All →</a></div><div class="duty-list">${
      dutyDoctors.length
        ? dutyDoctors
            .slice(0, 3)
            .map(
              (d) =>
                `<div class="duty-row">${person(d.name, d.department)}${badge(doctorAvailability(d))}</div>`,
            )
            .join('')
        : '<p class="empty">No doctors on duty today.</p>'
    }</div></section></div><section class="panel"><div class="panel-heading"><div><h2>Appointments Today</h2><p>${list.length} appointments on the schedule</p></div><a href="#appointments">View All →</a></div>${table(
      ['#', 'Patient', 'Doctor', 'Department', 'Time', 'Status'],
      list.map((a, i) => [
        i + 1,
        person(patientName(getPatient(a.patientId))),
        e(getDoctor(a.doctorId)?.name),
        e(a.department),
        timeText(a.time),
        badge(a.status),
      ]),
      'No appointments scheduled today.',
      'New appointments can be scheduled starting tomorrow.',
    )}</section>`;
}

// ---------- Patients and medical records ----------

function lastVisit(id) {
  return (
    getRecords()
      .filter((r) => r.patientId === id && r.isActive)
      .map((r) => r.date)
      .sort()
      .at(-1) || '' // return empty string if no records found
  );
}

function renderPatients() {
  patientArchiveView = false;
  patientPage = 1;
  $('#patientsPage').innerHTML =
    heading(
      'Patients',
      'Manage clinic patient information and medical records.',
      '<div class="actions">' +
        button('Archived Patients', 'archived-patients', '', 'secondary') +
        button('Add Patient', 'add-patient', '', '', 'plus') +
        '</div>',
    ) +
    `<section class="panel"><div class="toolbar">${searchField('Search patient ID, name or contact number')}</div><div id="patient-results"></div></section>`;
  $('input[name=search]', $('#patientsPage')).oninput = () => {
    patientPage = 1;
    updatePatientList();
  };
  updatePatientList();
}

function updatePatientList() {
  const q = $('input[name=search]', $('#patientsPage'))
      .value.trim()
      .toLowerCase(),
    all = activePatients();
  const list = all.filter((p) =>
    `${p.id} ${patientName(p)} ${p.contact}`.toLowerCase().includes(q),
  );
  const pages = Math.max(1, Math.ceil(list.length / 10));
  patientPage = Math.min(patientPage, pages);
  const start = (patientPage - 1) * 10;
  $('#patient-results').innerHTML =
    table(
      [
        'Patient ID',
        'Patient Name',
        'Age',
        'Gender',
        'Contact Number',
        'Last Visit',
        'Status',
        'Action',
      ],
      list
        .slice(start, start + 10)
        .map((p) => [
          e(p.id),
          person(patientName(p)),
          calculateAge(p.birthDate),
          e(p.gender),
          e(p.contact),
          formatDate(lastVisit(p.id)),
          badge('Active'),
          `<div class="actions">${actionButton('View patient', 'view-patient', p.id, 'eye')}${actionButton('Edit patient', 'edit-patient', p.id, 'edit')}${actionButton('Archive patient', 'archive-patient', p.id, 'archive')}</div>`,
        ]),
      all.length ? 'No records found.' : 'No patients yet.',
      all.length
        ? 'Try another search.'
        : 'Add a patient to begin creating clinic records.',
    ) +
    `<div class="pagination"><span>Showing ${list.length ? start + 1 : 0}–${Math.min(start + 10, list.length)} of ${list.length} patients</span><div class="row"><button class="button secondary" data-action="previous-patients" ${patientPage === 1 ? 'disabled' : ''}>Previous</button><span>${patientPage} / ${pages}</span><button class="button secondary" data-action="next-patients" ${patientPage === pages ? 'disabled' : ''}>Next</button></div></div>`;
}

function openPatientForm(id = '') {
  const p = getPatient(id) || {};
  openModal(
    id ? 'Edit Patient' : 'Add Patient',
    formStart +
      `<h3 class="form-section">Personal Information</h3>${field('First Name', 'firstName', p.firstName, 'text', true, 'maxlength="60"')}${field('Middle Name', 'middleName', p.middleName, 'text', false, 'maxlength="60"')}${field('Last Name', 'lastName', p.lastName, 'text', true, 'maxlength="60"')}${field('Birth Date', 'birthDate', p.birthDate, 'date', true, `max="${today()}"`)}${field('Age', 'age', p.birthDate ? calculateAge(p.birthDate) : '', 'text', false, 'readonly')}${selectField('Gender', 'gender', ['Male', 'Female', 'Other'], p.gender, true, 'Select gender')}<h3 class="form-section">Contact Information</h3>${field('Contact Number', 'contact', p.contact, 'tel', true, 'maxlength="20"')}${field('Email', 'email', p.email, 'email', false, 'maxlength="120"')}${textField('Address', 'address', p.address, true)}<h3 class="form-section">Emergency Contact</h3>${field('Emergency Contact Name', 'emergencyName', p.emergencyName)}${field('Relationship', 'relationship', p.relationship)}${field('Emergency Contact Number', 'emergencyPhone', p.emergencyPhone, 'tel', false, 'maxlength="20"')}` +
      formEnd('Save Patient'),
  );
  const form = $('#editor-form');
  form.elements.birthDate.oninput = () =>
    (form.elements.age.value = form.elements.birthDate.value
      ? calculateAge(form.elements.birthDate.value)
      : '');
  bindForm(form, (values, f) => savePatient(values, f, id));
}

function savePatient(values, form, id) {
  const errors = {};
  if (values.birthDate > today() || calculateAge(values.birthDate) > 130)
    errors.birthDate = 'Enter a birth date within the past 130 years.';
  for (const key of ['contact', 'emergencyPhone'])
    if (
      values[key] &&
      (!/^[+\d ()-]+$/.test(values[key]) || // allow digits, spaces, parentheses, plus and hyphen
        values[key].replace(/\D/g, '').length < 11)
    )
      errors[key] = 'Enter a valid phone number with at least 11 digits.';
  if (Object.keys(errors).length) return showErrors(form, errors);
  const previous = getPatient(id);
  delete values.age;
  replaceRecord('patients', {
    ...previous,
    ...values,
    id: id || nextId('patients', 'PT-' + new Date().getFullYear()),
    isActive: previous?.isActive ?? true,
    createdAt: previous?.createdAt || today(),
  });
  closeModal(true);
  refreshPage();
  showToast(
    id ? 'Patient information updated.' : 'Patient saved successfully.',
  );
}

function archivePatient(id) {
  confirmAction(
    'Archive Patient?',
    'This patient will no longer appear in the active patient list.',
    'Archive Patient',
    () => {
      const patient = getPatient(id);
      if (!patient || patient.isActive === false) return;
      replaceRecord('patients', {
        ...patient,
        isActive: false,
        archivedAt: new Date().toISOString(),
      });
      profilePatient = null;
      renderPatients();
      refreshPatientSummaries();
      showToast('Patient archived.');
    },
  );
}

function renderArchivedPatients() {
  patientArchiveView = true;
  profilePatient = null;
  const patients = getPatients().filter((p) => p.isActive === false);
  const archivedDate = (value) =>
    value && !Number.isNaN(Date.parse(value))
      ? new Date(value).toLocaleDateString('en-PH', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : 'Not recorded';
  $('#patientsPage').innerHTML =
    heading(
      'Archived Patients',
      'View patients that were removed from the active patient list.',
      button('Back to Patients', 'active-patients', '', 'secondary'),
    ) +
    `<section class="panel">${table(
      [
        'Patient ID',
        'Patient Name',
        'Age',
        'Gender',
        'Contact Number',
        'Archived Date',
        'Action',
      ],
      patients.map((p) => [
        e(p.id),
        person(patientName(p)),
        calculateAge(p.birthDate),
        e(p.gender),
        e(p.contact),
        e(archivedDate(p.archivedAt)),
        `<div class="actions">${button('View', 'view-patient', p.id, 'secondary', 'eye')}${button('Restore', 'restore-patient', p.id)}</div>`,
      ]),
      'No archived patients.',
      'Patients you archive will appear here.',
    )}</section>`;
}

function refreshPatientSummaries() {
  renderDashboard();

  if ($('#report-form')) generateReport();
}

function restorePatient(id) {
  confirmAction(
    'Restore Patient?',
    'This patient will return to the active patient list.',
    'Restore Patient',
    () => {
      const patient = getPatient(id);
      if (!patient || patient.isActive !== false) return;
      replaceRecord('patients', {
        ...patient,
        isActive: true,
        archivedAt: null,
      });
      renderArchivedPatients();
      refreshPatientSummaries();
      showToast('Patient restored successfully.');
    },
  );
}

function viewPatient(id) {
  const p = getPatient(id);
  profilePatient = id;
  $('#patientsPage').innerHTML =
    heading(
      p.isActive === false ? 'Archived Patient' : 'Patient Profile',
      'Patient information and consultation history.',
      button('Back', 'back-patients', '', 'secondary'),
    ) +
    `<section class="panel"><div class="profile-summary">${person(patientName(p), p.id + ' · ' + calculateAge(p.birthDate) + ' years · ' + p.gender)}${p.isActive === false ? badge('Archived') : ''}${button('Edit Patient', 'edit-patient', id, 'secondary', 'edit')}</div><dl class="details">${[
      ['Contact Number', p.contact],
      ['Email', p.email || '—'],
      ['Address', p.address],
      ['Emergency Contact', p.emergencyName || '—'],
      ['Relationship', p.relationship || '—'],
      ['Emergency Contact Number', p.emergencyPhone || '—'],
    ]
      .map(
        ([label, value]) => `<div><dt>${label}</dt><dd>${e(value)}</dd></div>`,
      )
      .join(
        '',
      )}</dl></section><section class="panel"><div class="panel-heading"><h2>Medical Records</h2>${button('Add Medical Record', 'add-record', id, '', 'plus')}</div><div id="record-results"></div></section>`;
  renderMedicalRecords();
}

function renderMedicalRecords() {
  const records = getRecords()
    .filter((r) => r.patientId === profilePatient && r.isActive)
    .sort((a, b) => b.date.localeCompare(a.date));
  $('#record-results').innerHTML = table(
    ['Date', 'Complaint', 'Diagnosis', 'Treatment', 'Doctor', 'Action'],
    records.map((r) => [
      formatDate(r.date),
      e(r.complaint),
      e(r.diagnosis),
      e(r.treatment),
      e(getDoctor(r.doctorId)?.name),
      `<div class="actions">${actionButton('View record', 'view-record', r.id, 'eye')}${actionButton('Edit record', 'edit-record', r.id, 'edit')}${actionButton('Archive record', 'archive-record', r.id, 'archive')}</div>`,
    ]),
    'No medical records available.',
    'Add a medical record after a consultation.',
  );
}

function openRecordForm(id = '') {
  const r = getRecords().find((item) => item.id === id) || {},
    p = getPatient(profilePatient);
  const doctors = activeDoctors();
  if (r.doctorId && !doctors.some((d) => d.id === r.doctorId))
    doctors.push(getDoctor(r.doctorId));
  if (!doctors.length)
    return showToast(
      'Add a doctor before creating a medical record.',
      'warning',
    );
  openModal(
    id ? 'Edit Medical Record' : 'Add Medical Record',
    formStart +
      field(
        'Date',
        'date',
        r.date || today(),
        'date',
        true,
        `min="${p.birthDate}" max="${today()}"`,
      ) +
      selectField(
        'Doctor',
        'doctorId',
        doctors.map((d) => [d.id, d.name]),
        r.doctorId,
        true,
        'Select doctor',
      ) +
      textField('Complaint', 'complaint', r.complaint, true) +
      textField('Diagnosis', 'diagnosis', r.diagnosis, true) +
      textField('Treatment', 'treatment', r.treatment, true) +
      textField('Notes', 'notes', r.notes) +
      formEnd('Save Medical Record'),
  );
  bindForm($('#editor-form'), (values, form) => {
    if (values.date > today() || values.date < p.birthDate)
      return showErrors(form, {
        date: 'Use a date between the birth date and today.',
      });
    replaceRecord('records', {
      ...r,
      ...values,
      id: id || nextId('records', 'MR'),
      patientId: p.id,
      isActive: true,
    });
    closeModal(true);
    renderMedicalRecords();
    showToast('Medical record saved successfully.');
  });
}

function viewRecord(id) {
  const r = getRecords().find((item) => item.id === id);
  openModal(
    'Medical Record',
    `<dl class="detail-list">${[
      ['Date', formatDate(r.date)],
      ['Complaint', r.complaint],
      ['Diagnosis', r.diagnosis],
      ['Treatment', r.treatment],
      ['Doctor', getDoctor(r.doctorId)?.name],
      ['Notes', r.notes || '—'],
    ]
      .map(
        ([label, value]) => `<div><dt>${label}</dt><dd>${e(value)}</dd></div>`,
      )
      .join(
        '',
      )}</dl><div class="form-actions">${button('Close', 'close', '', 'secondary')}</div>`,
  );
}

function archiveRecord(id) {
  confirmAction(
    'Archive Medical Record?',
    'This record will be retained but hidden from the patient’s medical record list.',
    'Archive Record',
    () => {
      replaceRecord('records', {
        ...getRecords().find((r) => r.id === id),
        isActive: false,
      });
      renderMedicalRecords();
      showToast('Medical record archived.');
    },
  );
}

// ---------- Doctors and weekly schedules ----------

function renderDoctors() {
  $('#doctorsPage').innerHTML =
    heading(
      'Doctors',
      'Manage clinic doctors and their availability.',
      button('Add Doctor', 'add-doctor', '', '', 'plus'),
    ) +
    `<section class="panel"><div class="toolbar">${searchField('Search doctor name or department')}${selectField('Department', 'departmentFilter', ['All departments', ...departments])}${selectField('Availability', 'availabilityFilter', ['All availability', 'Available', 'Busy', 'Unavailable'])}</div><div id="doctor-results"></div></section>`;
  $('.toolbar', $('#doctorsPage')).oninput = updateDoctorList;
  updateDoctorList();
}

function updateDoctorList() {
  const root = $('#doctorsPage'),
    q = $('input[name=search]', root).value.toLowerCase(),
    department = $('[name=departmentFilter]', root).value,
    availability = $('[name=availabilityFilter]', root).value;
  const all = activeDoctors(),
    list = all.filter(
      (d) =>
        `${d.name} ${d.department}`.toLowerCase().includes(q) &&
        (department === 'All departments' || d.department === department) &&
        (availability === 'All availability' ||
          doctorAvailability(d) === availability),
    );
  $('#doctor-results').innerHTML = table(
    [
      'Doctor Name',
      'Department',
      'Available Days',
      'Schedule',
      'Status',
      'Action',
    ],
    list.map((d) => [
      person(d.name),
      e(d.department),
      d.days.map((day) => weekdays[day].slice(0, 3)).join(' · '),
      timeText(d.start) + ' – ' + timeText(d.end),
      badge(doctorAvailability(d)),
      `<div class="actions">${actionButton('View Schedule', 'doctor-schedule', d.id, 'eye')}${actionButton('Edit doctor', 'edit-doctor', d.id, 'edit')}${actionButton('Remove doctor', 'remove-doctor', d.id, 'archive')}</div>`,
    ]),
    all.length ? 'No records found.' : 'No doctors added yet.',
    all.length
      ? 'Try another search or filter.'
      : 'Add a doctor to create schedules.',
  );
}

function openDoctorForm(id = '') {
  const d = getDoctor(id) || {};
  openModal(
    id ? 'Edit Doctor' : 'Add Doctor',
    formStart +
      field('Doctor Name', 'name', d.name, 'text', true, 'maxlength="120"') +
      selectField(
        'Department',
        'department',
        departments,
        d.department,
        true,
        'Select department',
      ) +
      `<fieldset class="days full" aria-describedby="error-days"><legend>Available Days *</legend>${[1, 2, 3, 4, 5, 6, 0].map((day) => `<label class="check"><input type="checkbox" name="days" value="${day}" ${d.days?.includes(day) ? 'checked' : ''}>${weekdays[day]}</label>`).join('')}<small id="error-days" class="field-error full"></small></fieldset>` +
      field(
        'Start Time',
        'start',
        d.start || '09:00',
        'time',
        true,
        'step="1800"',
      ) +
      field('End Time', 'end', d.end || '17:00', 'time', true, 'step="1800"') +
      selectField(
        'Status',
        'status',
        [
          ['available', 'Available'],
          ['busy', 'Busy'],
          ['unavailable', 'Unavailable'],
        ],
        d.status || 'available',
        true,
      ) +
      formEnd(id ? 'Save Changes' : 'Add Doctor'),
  );
  bindForm($('#editor-form'), (values, form) => saveDoctor(values, form, id));
}

function saveDoctor(values, form, id) {
  const days = $$('input[name=days]:checked', form).map((input) =>
      Number(input.value),
    ),
    errors = {};
  if (!['available', 'busy', 'unavailable'].includes(values.status))
    errors.status = 'Choose a valid status.';
  if (!days.length) errors.days = 'Choose at least one working day.';
  if (minutes(values.end) <= minutes(values.start))
    errors.end = 'End time must be after start time.';
  if (minutes(values.start) % 30 || minutes(values.end) % 30)
    errors.start = 'Use times on the hour or half hour.';

  const conflicts = getAppointments()
    .filter(
      (a) =>
        a.doctorId === id &&
        a.date >= today() &&
        ['Scheduled', 'Confirmed'].includes(a.status),
    )
    .some(
      (a) =>
        !days.includes(parseDate(a.date).getDay()) ||
        minutes(a.time) < minutes(values.start) ||
        minutes(a.time) + 30 > minutes(values.end),
    );
  if (conflicts)
    errors.start =
      'Reschedule or cancel existing appointments before changing their working hours.';
  if (Object.keys(errors).length) return showErrors(form, errors);
  replaceRecord('doctors', {
    id: id || nextId('doctors', 'DR'),
    name: values.name,
    department: values.department,
    days,
    start: values.start,
    end: values.end,
    status: values.status,
    isActive: true,
  });
  closeModal(true);
  renderDoctors();
  renderDashboard();
  renderAppointments();
  showToast(id ? 'Doctor information updated.' : 'Doctor added successfully.');
}

function removeDoctor(id) {
  confirmAction(
    'Remove Doctor?',
    'This doctor will no longer be available for new appointments.',
    'Remove Doctor',
    () => {
      replaceRecord('doctors', { ...getDoctor(id), isActive: false });
      renderDoctors();
      showToast('Doctor removed from new bookings.');
    },
  );
}

function viewDoctorSchedule(id) {
  const d = getDoctor(id);
  openModal(
    'Doctor Schedule',
    `${person(d.name, d.department)}<p class="form-note">Status: ${e(doctorAvailability(d))}</p><div class="schedule">${[1, 2, 3, 4, 5, 6, 0].map((day) => `<div class="schedule-row"><span>${weekdays[day]}</span><span>${d.days.includes(day) ? timeText(d.start) + ' – ' + timeText(d.end) : 'Unavailable'}</span></div>`).join('')}<div class="schedule-row"><strong>Today's Availability</strong>${badge(doctorAvailability(d))}</div></div><div class="form-actions">${button('Close', 'close', '', 'secondary')}</div>`,
  );
}

// ---------- Appointments: advance booking and conflict checks ----------

function validateAppointmentDate(date) {
  return date >= tomorrow();
}

function getAvailableDoctors(department) {
  return activeDoctors().filter(
    (d) => d.department === department && d.status !== 'unavailable',
  );
}

function getAvailableTimeSlots(doctorId, date, excludeId = '', patientId = '') {
  const d = getDoctor(doctorId);
  if (
    !d ||
    !d.isActive ||
    d.status === 'unavailable' ||
    !validateAppointmentDate(date) ||
    !d.days.includes(parseDate(date).getDay())
  )
    return [];
  const slots = [];

  for (
    let minute = minutes(d.start);
    minute + 30 <= minutes(d.end);
    minute += 30
  ) {
    const time = `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;

    const booked = getAppointments().some(
      (a) =>
        a.id !== excludeId &&
        a.status !== 'Cancelled' &&
        a.date === date &&
        a.time === time &&
        (a.doctorId === doctorId || a.patientId === patientId),
    );

    if (!booked) slots.push(time);
  }
  return slots;
}

function renderAppointments() {
  $('#appointmentsPage').innerHTML =
    heading(
      'Appointments',
      'Manage clinic appointments and schedules.',
      button('Schedule Appointment', 'add-appointment', '', '', 'plus'),
    ) +
    `<section class="panel"><div class="toolbar">${searchField('Search patient name/ID, appointment ID or doctor')}${field('Date', 'dateFilter', '', 'date')}${selectField('Status', 'statusFilter', ['All statuses', ...statuses])}</div><div id="appointment-results"></div></section>`;
  $('.toolbar', $('#appointmentsPage')).oninput = updateAppointmentList;
  updateAppointmentList();
}

function updateAppointmentList() {
  const root = $('#appointmentsPage'),
    q = $('input[name=search]', root).value.toLowerCase(),
    date = $('[name=dateFilter]', root).value,
    status = $('[name=statusFilter]', root).value;
  const all = getAppointments(),
    list = all
      .filter(
        (a) =>
          `${a.id} ${a.patientId} ${patientName(getPatient(a.patientId))} ${getDoctor(a.doctorId)?.name}`
            .toLowerCase()
            .includes(q) &&
          (!date || a.date === date) &&
          (status === 'All statuses' || a.status === status),
      )
      .sort(
        (a, b) => b.date.localeCompare(a.date) || a.time.localeCompare(b.time),
      );
  $('#appointment-results').innerHTML = table(
    [
      'Appointment ID',
      'Patient',
      'Doctor',
      'Department',
      'Date',
      'Time',
      'Status',
      'Action',
    ],
    list.map((a) => [
      e(a.id),
      person(patientName(getPatient(a.patientId))),
      e(getDoctor(a.doctorId)?.name),
      e(a.department),
      formatDate(a.date),
      timeText(a.time),
      badge(a.status),
      `<div class="actions">${actionButton('View appointment', 'view-appointment', a.id, 'eye')}${actionButton('Edit appointment', 'edit-appointment', a.id, 'edit')}${['Scheduled', 'Confirmed'].includes(a.status) ? actionButton('Cancel appointment', 'cancel-appointment', a.id, 'close') : ''}</div>`,
    ]),
    all.length ? 'No records found.' : 'No appointments scheduled.',
    all.length
      ? 'Try another search or filter.'
      : 'Add a patient and doctor, then schedule an appointment.',
  );
}

function patientSearchField(patient) {
  return `<div class="patient-picker full"><label for="patient-search"><span class="field-label">Patient *</span></label><input id="patient-search" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="appointment-patient-results" aria-describedby="error-patientId" autocomplete="off" placeholder="Search by patient name or ID..." value="${e(patient ? patientName(patient) : '')}"><input type="hidden" name="patientId" value="${e(patient?.id || '')}"><div id="appointment-patient-results" class="patient-results" role="listbox" aria-label="Matching patients" hidden></div><small id="patient-result-count" class="patient-result-count" role="status"></small><small class="field-error" id="error-patientId"></small></div>`;
}

function bindPatientSearch(form, onChange, historical) {
  const input = $('#patient-search', form),
    list = $('#appointment-patient-results', form),
    count = $('#patient-result-count', form);
  const hidden = form.elements.patientId,
    wrapper = $('.patient-picker', form);
  let matches = [],
    active = -1;
  const close = () => {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    active = -1;
  };
  const highlight = () => {
    const options = $$('[role=option]', list);
    options.forEach((option, index) =>
      option.setAttribute('aria-selected', String(index === active)),
    );
    if (options[active]) {
      input.setAttribute('aria-activedescendant', options[active].id);
      options[active].scrollIntoView({ block: 'nearest' });
    }
  };
  const search = () => {
    const query = input.value.trim().toLowerCase();
    matches = activePatients().filter((p) =>
      `${patientName(p)} ${p.id}`.toLowerCase().includes(query),
    );
    list.replaceChildren();
    active = -1;
    matches.forEach((patient, index) => {
      const option = document.createElement('div');
      option.id = `patient-option-${index}`;
      option.className = 'patient-option';
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      const id = document.createElement('strong'),
        name = document.createElement('span');
      id.textContent = patient.id;
      name.textContent = patientName(patient);
      option.append(id, name);
      option.onmousedown = (event) => event.preventDefault();
      option.onclick = () => select(index);
      list.append(option);
    });
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'patient-no-match';
      empty.textContent = 'No matching patient found.';
      list.append(empty);
    }
    count.textContent = matches.length
      ? `${matches.length} matching patients.`
      : 'No matching patient found.';
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    input.removeAttribute('aria-activedescendant');
  };
  const select = (index) => {
    const patient = getPatient(matches[index]?.id);
    if (!patient || patient.isActive === false) {
      hidden.value = '';
      search();
      onChange();
      return;
    }
    hidden.value = patient.id;
    input.value = patientName(patient);
    input.removeAttribute('aria-invalid');
    $('#error-patientId', form).textContent = '';
    count.textContent = `Selected ${patient.id}.`;
    close();
    input.focus();
    onChange();
  };
  input.disabled = historical;
  input.oninput = () => {
    hidden.value = '';
    search();
    onChange();
  };
  input.onclick = () => {
    if (list.hidden) search();
  };
  input.onkeydown = (event) => {
    if (event.key === 'Escape' && !list.hidden) {
      event.preventDefault();
      event.stopPropagation();
      close();
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (list.hidden) search();
      if (matches.length)
        active =
          event.key === 'ArrowDown'
            ? (active + 1) % matches.length
            : active < 0
              ? matches.length - 1
              : (active - 1 + matches.length) % matches.length;
      highlight();
    }
    if (event.key === 'Enter' && !list.hidden) {
      event.preventDefault();
      if (active >= 0) select(active);
    }
    if (event.key === 'Tab') close();
  };
  wrapper.onfocusout = (event) => {
    if (!wrapper.contains(event.relatedTarget)) close();
  };
}

function openAppointmentForm(id = '') {
  const a = getAppointments().find((item) => item.id === id) || {};
  if (!id && (!activePatients().length || !activeDoctors().length))
    return showToast(
      'Add an active patient and doctor before scheduling.',
      'warning',
    );

  const historical = !!id && a.date < tomorrow();
  openModal(
    id ? 'Edit Appointment' : 'Schedule Appointment',
    formStart +
      patientSearchField(getPatient(a.patientId)) +
      selectField(
        'Department',
        'department',
        departments,
        a.department,
        true,
        'Select department',
      ) +
      selectField('Doctor', 'doctorId', [], a.doctorId, true, 'Select doctor') +
      field(
        'Appointment Date',
        'date',
        a.date || tomorrow(),
        'date',
        true,
        `min="${tomorrow()}"`,
      ) +
      selectField(
        'Available Time',
        'time',
        [],
        a.time,
        true,
        'Select available time',
      ) +
      textField('Reason for Visit', 'reason', a.reason, true) +
      selectField('Status', 'status', statuses, a.status || 'Scheduled', true) +
      textField('Notes', 'notes', a.notes) +
      `<p id="slot-note" class="form-note full"></p>` +
      formEnd(id ? 'Save Changes' : 'Schedule Appointment'),
  );
  const form = $('#editor-form');
  form.dataset.appointment = 'true';

  const refreshSlots = () => {
    const doctor = getDoctor(form.elements.doctorId.value),
      date = form.elements.date.value;
    let slots = getAvailableTimeSlots(
      form.elements.doctorId.value,
      date,
      id,
      form.elements.patientId.value,
    );

    const unchanged =
      id &&
      form.elements.doctorId.value === a.doctorId &&
      date === a.date &&
      form.elements.patientId.value === a.patientId;
    if (unchanged && !slots.includes(a.time)) slots.push(a.time);
    const selected = form.elements.time.value || a.time;
    form.elements.time.innerHTML = selectOptions(
      slots.sort().map((time) => [time, timeText(time)]),
      selected,
      'Select available time',
    );
    $('#slot-note').textContent = historical
      ? 'Historical appointment: patient, doctor, date and time are read-only.'
      : !validateAppointmentDate(date)
        ? 'Appointments must be scheduled at least one day in advance.'
        : doctor && !doctor.days.includes(parseDate(date).getDay())
          ? 'This doctor is not scheduled on the selected day.'
          : doctor && !slots.length
            ? 'No available times on this date.'
            : 'Appointments use 30-minute intervals. Choose a future working day.';
  };

  const refreshDoctors = () => {
    const selected = form.elements.doctorId.value || a.doctorId;
    const list = getAvailableDoctors(form.elements.department.value).filter(
      (d) =>
        d.status !== 'busy' ||
        getAvailableTimeSlots(
          d.id,
          form.elements.date.value,
          id,
          form.elements.patientId.value,
        ).length,
    );
    if (
      id &&
      form.elements.department.value === a.department &&
      !list.some((d) => d.id === a.doctorId)
    )
      list.push(getDoctor(a.doctorId));
    form.elements.doctorId.innerHTML = selectOptions(
      list.map((d) => [d.id, d.name + (!d.isActive ? ' (removed)' : '')]),
      selected,
      'Select doctor',
    );
    refreshSlots();
  };

  refreshDoctors();
  form.elements.department.onchange = refreshDoctors;

  form.elements.doctorId.onchange = refreshSlots;
  form.elements.date.onchange = refreshDoctors;

  if (historical)
    ['patientId', 'department', 'doctorId', 'date', 'time'].forEach(
      (name) => (form.elements[name].disabled = true),
    );
  bindPatientSearch(form, refreshDoctors, historical);
  bindForm(form, (values, f) => saveAppointment(values, f, id, historical));
}

function saveAppointment(values, form, id, historical) {
  const previous = getAppointments().find((a) => a.id === id),
    data = { ...previous, ...values };

  const sameSlot =
    previous &&
    ['patientId', 'doctorId', 'date', 'time'].every(
      (key) => data[key] === previous[key],
    );

  const statusOnly =
    historical &&
    sameSlot &&
    (previous.status !== 'Cancelled' || data.status === 'Cancelled');

  const reopening =
    previous?.status === 'Cancelled' && data.status !== 'Cancelled';
  const errors = {},
    doctor = getDoctor(data.doctorId),
    patient = getPatient(data.patientId);
  if (!statusOnly && !validateAppointmentDate(data.date))
    errors.date = 'Appointments must be scheduled at least one day in advance.';
  if (!patient || ((!sameSlot || reopening) && patient.isActive === false))
    errors.patientId = 'Select a patient from the search results.';
  if (
    (!sameSlot || reopening) &&
    (!doctor?.isActive || doctor.status === 'unavailable')
  )
    errors.doctorId = 'Choose an active available doctor.';
  if (
    !sameSlot &&
    doctor &&
    !doctor.days.includes(parseDate(data.date).getDay())
  )
    errors.date = 'This doctor is not scheduled on the selected day.';
  if (
    !sameSlot &&
    !getAvailableTimeSlots(
      data.doctorId,
      data.date,
      id,
      data.patientId,
    ).includes(data.time)
  )
    errors.time = 'Choose an available time. This slot may already be booked.';
  if (
    data.status !== 'Cancelled' &&
    getAppointments().some(
      (a) =>
        a.id !== id &&
        a.status !== 'Cancelled' &&
        a.date === data.date &&
        a.time === data.time &&
        (a.doctorId === data.doctorId || a.patientId === data.patientId),
    )
  )
    errors.time =
      'The doctor or patient already has an appointment at this time.';
  if (
    previous?.status === 'Cancelled' &&
    data.status !== 'Cancelled' &&
    !getAvailableTimeSlots(
      data.doctorId,
      data.date,
      id,
      data.patientId,
    ).includes(data.time)
  )
    errors.time =
      'This cancelled appointment cannot be restored to an unavailable slot.';
  if (Object.keys(errors).length) return showErrors(form, errors);
  replaceRecord('appointments', {
    ...data,
    id: id || nextId('appointments', 'AP'),
  });
  closeModal(true);
  updateAppointmentList();
  showToast(
    id
      ? 'Appointment updated successfully.'
      : 'Appointment scheduled successfully.',
  );
}

function viewAppointment(id) {
  const a = getAppointments().find((item) => item.id === id);
  openModal(
    'Appointment ' + a.id,
    `<dl class="detail-list">${[
      ['Patient', patientName(getPatient(a.patientId))],
      ['Doctor', getDoctor(a.doctorId)?.name],
      ['Department', a.department],
      ['Date', formatDate(a.date)],
      ['Time', timeText(a.time)],
      ['Status', a.status],
      ['Reason for Visit', a.reason],
      ['Notes', a.notes || '—'],
    ]
      .map(
        ([label, value]) => `<div><dt>${label}</dt><dd>${e(value)}</dd></div>`,
      )
      .join(
        '',
      )}</dl><div class="form-actions">${button('Close', 'close', '', 'secondary')}</div>`,
  );
}

function cancelAppointment(id) {
  confirmAction(
    'Cancel Appointment?',
    'The appointment will remain in the records with a Cancelled status.',
    'Cancel Appointment',
    () => {
      replaceRecord('appointments', {
        ...getAppointments().find((a) => a.id === id),
        status: 'Cancelled',
      });
      updateAppointmentList();
      showToast('Appointment cancelled.');
    },
    'Keep Appointment',
  );
}

function renderReports() {
  const date = new Date(),
    year = date.getFullYear();

  const years = [
    ...new Set([
      year - 1,
      year,
      year + 1,
      ...getAppointments().map((a) => Number(a.date.slice(0, 4))),
      ...getPatients().map((p) => Number(p.createdAt.slice(0, 4))),
    ]),
  ].sort((a, b) => b - a);
  $('#reportsPage').innerHTML =
    heading('Reports', 'Generate and print clinic activity reports.') +
    `<section class="panel no-print"><form id="report-form" class="toolbar">${selectField(
      'Month',
      'month',
      months.map((name, i) => [String(i + 1).padStart(2, '0'), name]),
      String(date.getMonth() + 1).padStart(2, '0'),
    )}${selectField('Year', 'year', years, year)}<button type="submit" class="button">Generate Report</button></form></section><div id="report-output"></div>`;
  $('#report-form').onsubmit = async (event) => {
    event.preventDefault();
    const button = $('[type=submit]', event.target);
    button.disabled = true;
    button.textContent = 'Generating…';

    await new Promise((resolve) => setTimeout(resolve, 220));
    try {
      generateReport();
      showToast('Report generated successfully.');
    } finally {
      button.disabled = false;
      button.textContent = 'Generate Report';
    }
  };
  generateReport();
}

function generateReport() {
  const form = $('#report-form'),
    prefix = form.elements.year.value + '-' + form.elements.month.value;
  const title =
    months[Number(form.elements.month.value) - 1] +
    ' ' +
    form.elements.year.value;
  const appointments = getAppointments().filter((a) =>
    a.date.startsWith(prefix),
  );
  const patients = getPatients().filter(
    (p) => p.createdAt.slice(0, 7) <= prefix,
  );
  const newPatients = patients.filter((p) => p.createdAt.startsWith(prefix));
  const records = getRecords().filter(
    (r) => r.isActive && r.date.startsWith(prefix),
  );
  const completed = appointments.filter((a) => a.status === 'Completed').length,
    cancelled = appointments.filter((a) => a.status === 'Cancelled').length;

  const doctorIds = new Set(appointments.map((a) => a.doctorId));
  const doctorRows = getDoctors()
    .filter((d) => d.isActive || doctorIds.has(d.id))
    .map((d) => [
      e(d.name),
      e(d.department),
      appointments.filter((a) => a.doctorId === d.id).length,
      appointments.filter(
        (a) => a.doctorId === d.id && a.status === 'Completed',
      ).length,
    ]);

  const empty = !appointments.length && !records.length && !newPatients.length;
  $('#report-output').innerHTML =
    `<div class="stats no-print">${stat('Total Patients', patients.length, 'patients', 'Registered by month end')}${stat('Total Appointments', appointments.length, 'appointments', title)}${stat('Completed Appointments', completed, 'check', title)}${stat('Cancelled Appointments', cancelled, 'appointments', title)}</div><article class="panel report"><div class="report-heading"><div class="report-brand"><span class="report-mark" aria-hidden="true">M</span><div><h2>METROMED CLINIC</h2><p>Monthly Clinic Report</p><p>${e(title)}</p></div></div>${button('Print Report', 'print', '', 'secondary no-print', 'print')}</div><div class="panel-heading"><h3>Summary</h3></div><div class="report-summary">${[
      ['Total Patients', patients.length],
      ['New Patients', newPatients.length],
      [
        'Archived Patients',
        patients.filter((p) => p.isActive === false).length,
      ],
      ['Total Appointments', appointments.length],
      ['Completed Appointments', completed],
      ['Cancelled Appointments', cancelled],
      ['Active Doctors', activeDoctors().length],
    ]
      .map(
        ([label, value]) =>
          `<div><span>${label}</span><strong>${value}</strong></div>`,
      )
      .join(
        '',
      )}</div>${empty ? '<div class="empty"><strong>No clinic activity was recorded for this period.</strong></div>' : ''}<div class="report-visuals">${reportVisitChart(Number(form.elements.year.value), Number(form.elements.month.value), records)}<section class="report-status"><h3>Appointment Information</h3><div class="report-status-row"><span>Total Appointments</span><strong>${appointments.length}</strong></div>${['Scheduled', 'Confirmed', 'Waiting', 'Completed', 'Cancelled'].map((status) => `<div class="report-status-row">${badge(status)}<strong>${appointments.filter((a) => a.status === status).length}</strong></div>`).join('')}</section></div><div class="panel-heading"><h3>Doctor Activity</h3></div>${table(['Doctor', 'Department', 'Appointments', 'Completed'], doctorRows, 'No doctor activity for this period.', '')}</article>`;
}

function initializeApp() {
  try {
    initializeStorage();
  } catch {
    $('#auth').innerHTML =
      '<div class="auth-card"><h1>Browser storage unavailable</h1><p>Allow local storage and reopen the file. Existing data was not reset.</p></div>';
    return;
  }
  $('#navigation').innerHTML = [
    'dashboard',
    'patients',
    'appointments',
    'doctors',
    'reports',
  ]
    .map(
      (page) =>
        `<a class="nav-link" href="#${page}" data-page="${page}">${icon(page)}${page[0].toUpperCase() + page.slice(1)}</a>`,
    )
    .join('');
  $('#menu-button').innerHTML = icon('menu');
  $('.logout-button').innerHTML = icon('logout') + 'Log out';
  $$('#profile-menu button').forEach(
    (button) =>
      (button.innerHTML = icon(button.dataset.action) + button.textContent),
  );

  $('#menu-button').onclick = () =>
    toggleMenu(!$('#sidebar').classList.contains('open'));

  $('#shade').onclick = () => toggleMenu(false);

  $('#profile-button').onclick = () => toggleProfile($('#profile-menu').hidden);

  $('#modal-content').oninput = () => (dirty = true);

  $('#modal-content').onchange = () => (dirty = true);

  $('#modal').addEventListener('cancel', (event) => {
    event.preventDefault();
    closeModal();
  });

  for (const id of ['modal', 'confirm-modal'])
    $('#' + id).addEventListener('click', (event) => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        if (id === 'modal') closeModal();
        else event.currentTarget.close();
      }
    });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleProfile(false);
      if (!$('#modal').open && !$('#confirm-modal').open) toggleMenu(false);
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.profile-area')) toggleProfile(false);

    const nav = event.target.closest('[data-page]');
    if (nav && currentUser) {
      event.preventDefault();
      showPage(nav.dataset.page);
      return;
    }

    const auth = event.target.closest('[data-auth]');
    if (auth) {
      event.preventDefault();
      renderAuth(auth.dataset.auth);
      return;
    }

    const target = event.target.closest('[data-action]');
    if (!target) return;
    const id = target.dataset.id,
      action = target.dataset.action;

    if (action === 'toggle-password') {
      const input = target.previousElementSibling;
      input.type = input.type === 'password' ? 'text' : 'password';
      target.setAttribute(
        'aria-label',
        input.type === 'password' ? 'Show password' : 'Hide password',
      );
      return;
    }
    if (action === 'close') return closeModal();

    if (!currentUser) return;
    toggleProfile(false);

    const handlers = {
      profile: openProfile,
      password: openPassword,
      logout,
      'add-patient': () => openPatientForm(),
      'edit-patient': () => openPatientForm(id),
      'archive-patient': () => archivePatient(id),
      'view-patient': () => viewPatient(id),
      'archived-patients': renderArchivedPatients,
      'active-patients': () => {
        profilePatient = null;
        renderPatients();
      },
      'restore-patient': () => restorePatient(id),
      'back-patients': () => {
        profilePatient = null;
        patientArchiveView ? renderArchivedPatients() : renderPatients();
      },
      'previous-patients': () => {
        patientPage--;
        updatePatientList();
      },
      'next-patients': () => {
        patientPage++;
        updatePatientList();
      },
      'add-record': () => openRecordForm(),
      'edit-record': () => openRecordForm(id),
      'view-record': () => viewRecord(id),
      'archive-record': () => archiveRecord(id),
      'add-doctor': () => openDoctorForm(),
      'edit-doctor': () => openDoctorForm(id),
      'remove-doctor': () => removeDoctor(id),
      'doctor-schedule': () => viewDoctorSchedule(id),
      'add-appointment': () => openAppointmentForm(),
      'edit-appointment': () => openAppointmentForm(id),
      'view-appointment': () => viewAppointment(id),
      'cancel-appointment': () => cancelAppointment(id),
      print: () => window.print(),
    };

    try {
      handlers[action]?.();
    } catch {
      showToast('Unable to open this action. Reload and try again.', 'error');
    }
  });

  window.addEventListener('hashchange', () => {
    const page = location.hash.slice(1);
    if (
      currentUser &&
      ['dashboard', 'patients', 'appointments', 'doctors', 'reports'].includes(
        page,
      )
    )
      showPage(page);
  });
  try {
    const session = loadData('session', null);
    if (
      session &&
      (session.remember ||
        sessionStorage.getItem('metromedTabSession') === session.userId)
    )
      currentUser =
        loadData('users').find((user) => user.id === session.userId) || null;
  } catch {
    currentUser = null;
  }

  if (currentUser) enterApp();
  else renderAuth();
}

initializeApp();
