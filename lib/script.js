
/**
 * Create a health record transaction, this means for this transaction to execute the prescriber needs to have access to patient records
 * @param {org.iehr.transactions.refreshPatientHealthRecords} dataargs - health record to be created
 * @transaction
 */
function refreshPatientHealthRecords(dataargs){
    console.log("Create health record");


    var healthRecordRef = dataargs.healthRecord;
    var patientRecordRef = dataargs.patient.id;

    console.log("@IEHR-DEBUG-", healthRecordRef, patientRecordRef);
    return getParticipantRegistry('org.iehr.participants.Patient').then(function(patientRegistry){
        return patientRegistry.getAll();
    }).then(function (patients) {
        // Process the array of driver objects.
        patients.forEach(function (patient) {
            if(patient.id === patientRecordRef){
                if(!patient.patientHealthRecords){
                    patient.patientHealthRecords = [];
                }
                patient.patientHealthRecords.push(healthRecordRef);
                return getParticipantRegistry('org.iehr.participants.Patient').then(function(patientReg){
                    return patientReg.update(patient);
                });
            }
        });
    }); 
}

/**
 * Update health record transaction
 * @param {org.iehr.transactions.updateHealthRecord} updateHealthRecordArgs - health record to be updated
 * @transaction
 */
function updateHealthRecord(updateHealthRecordArgs) {
    console.log('Update health record');
  
    var healthRecordToUpdate = updateHealthRecordArgs.healthRecord;
    var visitDetails  		 = updateHealthRecordArgs.newVisit;
  	
    var id = healthRecordToUpdate.healthRecordID;
    return getAssetRegistry('org.iehr.assets.HealthRecord')
        .then(function(hrRegistry) {
            return hrRegistry.get(id).then(function(hrRecord) {
   				if(!hrRecord.visits){
                   hrRecord.visits = [];
                }
                hrRecord.visits.push(visitDetails);
                return hrRegistry.update(hrRecord);
            })
        })
}

/**
 * Update health record visibility to third party
 * @param {org.iehr.transactions.updateThirdPartyVisibility} updateTPArgs - health record to be updated
 * @transaction
 */
function updateThirdPartyVisibility(updateTPArgs) {
    console.log('Update Third party visibility');
  
    var healthRecordToUpdate = updateTPArgs.healthRecord;
    var isVisible  		     = updateTPArgs.isVisible;
  	
    var id = healthRecordToUpdate.healthRecordID;
    return getAssetRegistry('org.iehr.assets.HealthRecord')
        .then(function(hrRegistry) {
            return hrRegistry.get(id).then(function(hrRecord) {
                hrRecord.isVisibleToTP = isVisible;
                return hrRegistry.update(hrRecord);
            })
        })
}