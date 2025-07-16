export const usernameRegex = /^[a-zA-Z0-9_]{2,15}$/;

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])(.{8,20})$/;

export const phoneNumberRegex = /^[0-9\s]+$/;

export const roleRegex = /^[a-zA-Z0-9_]+$/;

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
