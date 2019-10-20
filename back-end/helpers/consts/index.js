import getRoleIDS from './Role_IDS';
import getRelationIDSMap from './Relation_IDS';
import getPatientInsurerMap from './Patient_Insurer_Map';
import getInsurerPatientMap from './Insurer_Patient_Map';

module.exports = {
    Role_IDS_Fetcher: getRoleIDS,
    Relation_IDS_Fetcher: getRelationIDSMap,
    Patient_Insurer_Map_Fetcher: getPatientInsurerMap,
    Insurer_Patient_Map_Fetcher: getInsurerPatientMap,
};
