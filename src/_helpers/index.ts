// export const baseUrl = 'http://localhost:8080';
import {RouteComponentProps} from 'react-router';
import queryString from 'query-string';

export const baseUrl = 'https://api.yankemall.ng';

/**
 * Returns the return url attached to url
 * @param  {RouteComponentProps['location']} location - DOM location object
 */
export const getReturnUrl = (
    location: RouteComponentProps['location'],
): string | undefined | null => {
    /**
     * Check if the queryUrl contains other parameters e.g ?return=/dashboard/overview&name=segun
     */
    const queryParams = queryString.parse(location.search);
    console.log(queryParams);
    let url = queryParams.returnUrl;
    if (url) {
        if (Object.keys(queryParams).length > 1 && typeof queryParams === 'object') {
            url += '?';
            for (const fragments in queryParams) {
                if (fragments === 'returnUrl') {
                    continue;
                }
                // @ts-ignore
                if (queryParams[fragments]) {
                    url += fragments + '=' + queryParams[fragments] + '&';
                }
            }
        }
    }
    return url !== null && typeof url === 'object' ? (url as string[]).join('') : (url as string);
};
