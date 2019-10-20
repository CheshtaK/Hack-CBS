import getMediclaimInfo from './model-helpers/mediclaim_info'

const getMediclaimInfoLoader = async keys =>
    new Promise(async (resolve, reject) => {
        const mediclaimInfo = [];
        for (let j = 0; j < keys.length; j += 1) {
            mediclaimInfo.push(getMediclaimInfo(keys[j]));
        }
        resolve(mediclaimInfo);
    });

export default getMediclaimInfoLoader;
