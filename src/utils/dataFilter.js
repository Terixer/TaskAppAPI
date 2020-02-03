const filterObjectByKeys = (objectToFilter, arrayWithKeyFilters) => {
    const filteredData = Object.keys(objectToFilter)
        .filter(singleFilterProperty => arrayWithKeyFilters.includes(singleFilterProperty))
        .reduce((newDataObject, currentPropertyKey) => {
            newDataObject[currentPropertyKey] = objectToFilter[currentPropertyKey];
            return newDataObject;
        }, {});
    return filteredData;
};

module.exports = {
    filterObjectByKeys
};