import IdentityGeneralComponent from './components/general/general.vue';
import IdentityVerificationsComponent from './components/verifications/verifications.vue';
import OverviewComponent from './components/overview/overview.vue';
import StartComponent from './components/start/start.vue';
import TemplatesComponent from './components/templates/templates.vue';
import LookupComponent from './components/lookup/lookup.vue';
// map them to element names, so they can be used within templates
var routeRegistration = [
    { name: 'base-start', path: '', component: StartComponent },
    { name: 'base-overview', path: 'overview', component: OverviewComponent },
    { name: 'base-templates', path: 'templates', component: TemplatesComponent },
    { name: 'base-lookup', path: 'lookup', component: LookupComponent },
    { name: 'identity-general', path: ':identityAddress', component: IdentityGeneralComponent },
    { name: 'identity-verifications', path: ':identityAddress/verifications', component: IdentityVerificationsComponent },
];
export default routeRegistration;
//# sourceMappingURL=routes.js.map