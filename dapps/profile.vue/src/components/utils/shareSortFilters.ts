export const sortFilters = {
  company: ['accountDetails', 'contact'],
  companyDE: ['accountDetails', 'contact', 'registration'],
  device: ['accountDetails', 'deviceDetails'],
  user: ['accountDetails'],
};

/**
 * Return the profile sharing sort filter for the profile type. (could differ for companies from
 * different countries)
 *
 * @param      {any}  profileData  profile data object (including accountDetails, contact, ...)
 */
export function getPermissionSortFilter(profileData: any) {
  let result = [];

  if (profileData && profileData.contact
      && sortFilters[`${profileData.accountDetails.profileType}${profileData.contact.country}`]) {
    result = sortFilters[`${profileData.accountDetails.profileType}${profileData.contact.country}`];
  } else if (profileData.accountDetails) {
    result = sortFilters[`${profileData.accountDetails.profileType}`];
  }

  return result;
}
