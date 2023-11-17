import {whatType} from "../utils";

export function extractURLParams(str) {
    if (str === '') return false;
    let params = {};
    const unparsed_params = str.split("?").pop().split("&");
    unparsed_params.map(p => {
        const p_arr = p.split('=');
        if (p_arr[1] !== '') params[p_arr[0]] = p_arr[1];
    })
    return params;
}

export function codeParamsToUrl(params, data) {
    switch (whatType(data)) {
        case 'object':
            return Object.keys(data).map(name => params.append(name, data[name]));
        case 'array':
            return data.map(f => {
                params.append(Object.keys(f)[0], Object.values(f)[0]);
            })
    }
}

export function decodeParamsFromUrl() {
    let filters = {};
    let sorting = '';
    let pagination = {};
    const paginationParamNames = ['resultsPerPage', 'current', 'offset'];
    const urlParams = new URLSearchParams(document.location.search);
    urlParams.delete('search');
    urlParams.delete('tab');
    sorting = urlParams.get('sort');
    urlParams.delete('sort');
    Array.from(urlParams, ([key, value]) => {
        const f = {};
        if (paginationParamNames.indexOf(key) > -1) {
            pagination[key] = Number(value);
        } else {
            filters[key] = value;
        }
    });
    return [filters, sorting, pagination]
}

export function updateUrl(url, params) {
    /*
    * url = string;
    * params = {search: searchTerm, tab: tabName, filters: filters,...}
    * */
    let paramsObj = new URLSearchParams();  // this is to be populated from scratch
    if (params['tab'] !== '') {
        paramsObj.set('tab', params['tab']);
        // process filters per tab only!
        if (params['filters'] && Object.keys(params['filters']).length > 0) {
            codeParamsToUrl(paramsObj, params['filters'])
        }
    }
    if (params['search']) {
        paramsObj.set('search', params['search']);
    }
    if (params['sort']) {
        paramsObj.set('sort', params['sort']);
    }
    history.pushState(null, 'Search', url + paramsObj.toString())
}
