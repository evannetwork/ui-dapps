import * as bcc from '@evan.network/api-blockchain-core';
export declare const latestIdentitiesKey = "evan-last-digital-identities";
/**
 * Return the last opened identities that were persited in the localStorage.
 */
export declare function getLastOpenedIdentities(): any;
/**
 * Copies and returns a runtime with the correct nameresolver for payable stuff.
 *
 * @param      {any}  runtime  vue instance or runtime
 */
export declare function getRuntime(runtime: any): bcc.Runtime;
/**
 * Returns the active domain name (currently payable, until the nameresolve is fixed)
 *
 * @return     {string}  domain name (default evan)
 */
export declare function getDomainName(): string;
/**
 * Returns a minimal dbcp description set.
 */
export declare function getIdentityBaseDbcp(): Promise<any>;
