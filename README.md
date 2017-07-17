# cics-nodejs-exci-webapp-sample
Sample application that uses the [sample cics-exci Node.js module](https://github.com/cicsdev/cics-nodejs-exci-node-module) to interact with CICS over the external CICS interface (EXCI)

To use this sample, you need to: 

1.	Install the sample
1.	Customize the files for your environment
1.	Compile and install a COBOL program
1.	Define the program to CICS
1.	Configure EXCI in your CICS region
1.	Run the sample

Instructions for all these steps are provided in this README.

This sample is made up of three parts:
1. Front end JavaScript application - Angular.js and jQuery making calls to back end app
1. Back end JavaScript application - Express.js and cics-exci receiving REST API calls and invoking CICS EXCI functionality using the cics-exci node module
1. EDUCHAN COBOL program used by sample to reverse string passed in over Channels and Containers

Read through the comments in the code to understand the flow of the application. The comments mainly focus on the use of the cics-exci node module, and this sample is not intended to teach the usage of Angular.js, Express.js or any other framework, and is not to be taken as best practice of these frameworks.

## Front end JavaScript app

The front end app is predominantly made up of Angular.js and jQuery, which is used to call our back end application. The main elements of the application are:
* __public/index.html__ - Basic HTML representation of the page
* __public/hello.js__ - JavaScript client side logic to call back end

## Back end JavaScript app

The back end application is made up of two parts, both contained within the __server.js__ file:
* Express.js REST API - this serves two purposes:
  * Serves the __public/index.html__ file
  * Is the REST API endpoint used by the client side JavaScript application
* CICS EXCI API calls - utilises the cics-exci node module to access CICS over EXCI

## EDUCHAN COBOL program

The __EDUCHAN.cbl__ COBOL program is used by the sample to reverse a string passed in over a CICS Container. This is a heavyweight solution for reversing a string in JavaScript, but demonstrates how you can call a CICS program (31-bit COBOL in this case), passing data in on a channel using a container, and then getting data back from the program in another container.

__Note:__ Any string you pass into EDUCHAN will be truncated to 72 characters, which should be more than enough to demonstrate reversing a string.

## Supporting files

* __jcl/cobcomp.jcl__ - this is sample JCL that you can use to compile the EDUCHAN program. Read the comments at the top of the file to customize as required.

## Pre-requisites
* IBM CICS Transaction Server for z/OS (CICS) V5.4 - you may run the cics-exci node against a pre-V5.4 CICS region, however the node module utilises EXCI Channels and Containers functionality implemented in CICS V5.4. As such the SDFHEXCI V5.4 library must be in your STEPLIB during execution.
* IBM SDK for Node.js - z/OS, beta 2 - [Download](https://developer.ibm.com/node/sdk/ztp/)
  * __Note:__ ensure that all setup has been completed before you try to use the cics-exci sample node, or this sample application.

## Installation

### cics-exci node module installation

You will need to install the [cics-exci](https://github.com/cicsdev/cics-nodejs-exci-module) node module before installing this sample. Follow the instructions in the README for the [https://github.com/cicsdev/cics-nodejs-exci-module](https://github.com/cicsdev/cics-nodejs-exci-module) GitHub repository to install.

### Cloning GitHub repository

You will first have to clone this GitHub repository onto z/OS. When cloning the GitHub repo, you have two options. Firstly, if possible, use the Git client for z/OS available for download from the [Rocket Software Open Source Tools website](http://www.rocketsoftware.com/zos-open-source/tools).

Alternatively download zipped repo, or clone, onto your local workstation and transfer the files to z/OS. Take care when transferring the files and ensure any file conversions happen as expected. Any zip files should be transferred as binary.

### Installing the sample

To install this sample, from within the repository's root directory, run:

```bash
$ npm install
```

This will pull down all dependencies and install. Once the installation is done copy the cics-exci node module installed above, into the node_modules directory for this sample, for example:

```bash
$ mkdir node_modules/cics-exci/
$ cp -R /u/user/GitHub/cics-nodejs-node-module/* node_modules/cics-exci/
```

## Configuration

### Customise files

To run the sample you will need to customise 2 files:
* __.env__ - the .env file in the root of the repo contains two variables
  * CICS_APPLID - set this to the APPLID hosting the EDUCHAN program
  * PORT - set this to an available port number which will be used by server.js to listen for connections to the Express.js endpoints.
* __public/hello.js__ - this file uses jQuery to call our REST API endpoint. You need to find the hostname and port it is calling in this file and change to the host name of your z/OS image, and the port number set above in the .env file. This is currently set to `http://localhost:3001` which will not work.

### Compile COBOL application and install

You will also need to compile and install the EDUCHAN COBOL program. You can use the sample JCL descibed above (be sure to customise as described in the file), or use your own custom COBOL compilation JCL.

Once compiled, you will need to define and install a CICS program resource definition. *Consult your local CICS Systems Programmer or similar CICS administrator for how to define and install program resources in your CICS region*.

### Configure EXCI

As this sample is utilising EXCI functionality, you will need to configure EXCI in your CICS region. See the [README in the cics-nodejs-exci-module GitHub repo](http://github.com/cicsdev/cics-nodejs-exci-module) for instructions on how to do this.

## Running the sample

```bash
$ node server.js
Example app listening on port 27164!
```
Once the server has started, from your workstation web browser go to: [http://myzossystem.mycompany.com:12345](http://myzossystem.mycompany.com:12345)

## Tell us more
This sample, along with the [sample cics-exci Node.js module](https://github.com/cicsdev/cics-nodejs-exci-node-module), give you a simple taste of Node.js on z/OS, interacting with CICS. We’re interested in your feedback on these and we’d also like to hear what other types of applications you want to build on z/OS. Please contact me at [markhollands@uk.ibm.com](mailto:markhollands@uk.ibm.com) to discuss further.
