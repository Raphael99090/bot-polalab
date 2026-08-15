function isStaff(member) {
  const staffRoleId = process.env.STAFF_ROLE_ID;
  if (staffRoleId && member.roles.cache.has(staffRoleId)) {
    return true;
  }
  return member.permissions.has('ManageGuild');
}

module.exports = { isStaff };