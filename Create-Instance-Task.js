
exports.helloPubSub = (event, callback) => {
'use strict';

const Compute = require('@google-cloud/compute');
//const http = require('http');

  const compute = new Compute({
    'projectId': 'pe-training'
  });
  const pubsubMessage = event.data;
  
  //console.log(Buffer.from(pubsubMessage.data, 'base64').toString());
  const json = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());
  
  const name = json.Name;
  const type = json.Size;
  const from = json.Sourcebucket;
  const to = 'gs://dharam1234';
  const zone = compute.zone('us-east1-b');

function createVm(name) {

  const config = {
    //'name':name,
    'machineType':type,
    'os': 'ubuntu',
    'http': true,
    'serviceAccounts': [{
            'email': 'default',
            'scopes': [
                'https://www.googleapis.com/auth/devstorage.read_write',
                'https://www.googleapis.com/auth/logging.write'
            ]
        }],
    'metadata': {
      'items': [
	    {
	      'key':'Bucketfrom',
	      'value': from
	    },
	    {
	      'key':'Bucketto',
	      'value': to
	    },
        {
          'key': 'startup-script',
          'value': `#! /bin/bash
				  gsutil cp Bucketfrom Bucketto `,
        },
      ],
    }

  };

  const vm = zone.vm(name);

  vm.create(config)
    .then(data => {
      const operation = data[1];
      return operation.promise();
    })
    .then(() => {
      return vm.getMetadata();
    })
    .then(data => {
      //const metadata = data[0];

      // External IP of the VM.
      //const ip = metadata.networkInterfaces[0].accessConfigs[0].natIP;
      //console.log(`Booting new VM with IP http://${ip}...`);
    	console.log("Process Completed");
    	deleteVm(name);
      
    })
    .catch(err => callback(err));
}




function deleteVm(name) {
  const vm = zone.vm(name);
  vm.delete()
    .then(data => {
      console.log('Deleting ...');
      const operation = data[0];
      return operation.promise();
    })
    .then(() => {
      // VM deleted
      console.log("VM Deleted");
      callback(null, name);
    })
    .catch(err => callback(err));
}

//exports.create = (name, cb) => {
  createVm(name);
//};


//exports.delete = (name, cb) => {
  //deleteVm(name);
//};
}

