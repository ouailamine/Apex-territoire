// Code snippet



// APEX SNIPPET






// DATE

function getMonthLabel(monthNumber) {
    switch (monthNumber) {
        case 0:
            return 'Jan';

        case 1:
            return 'Feb';

        case 2:
            return 'Mar';

        case 3:
            return 'Apr';

        case 4:
            return 'May';

        case 5:
            return 'Jun';

        case 6:
            return 'Jul';

        case 7:
            return 'Aug';

        case 8:
            return 'Sep';

        case 9:
            return 'Oct';

        case 10:
            return 'Nov';

        case 11:
            return 'Dec';
        default:
            return undefined;
    }
}

function getDayLabel(dayNumber) {
    switch (monthNumber) {
        case '1':
            return 'Mon';

        case '2':
            return 'Tue';

        case '3':
            return 'Wed';

        case '4':
            return 'Thu';

        case '5':
            return 'Fri';

        case '6':
            return 'Sat';

        case '0':
            return 'Sun';

        default:
            return undefined;
    }
}


// DATABASE

// FIRST LOADED QUERRY

/*

SELECT o.apexValue as obsvLabel, o.date as obsvDateInMs, o.latitude as obsvLat, o.longitude as obsvLng
, s.nomParcelle as parcelName, u.name as ownerName, s.globalLatitude as parcelLat, s.globalLongitude as parcelLng
, s.moyenne as sessionAvgGrowth, s.date as sessionDateInSec,
, u.name as userName, 
FROM User u, Session s, Observation o
WHERE s.userId = u.idUser and s.idSession = o.sessionId
and o.latitude != 0 and o.longitude != 0 and s.globalLatitude !=0 and s.globalLongitude !=0
and u.id =35 
;

*/

// FETCH DATA INTO A STRUCTURE OBJECT
function extractUserDataObjFrom(userDBRows) {

    let userDataObj = {};

    userDBRows.forEach(row => {
        // userData = [ { obsvLabel, obsDate, obsLat, obsLng,  parcelName,  parcelSessionAvgGrowth,  parcelSessionDate,  parcelLat, parcelLng, userName}, ...]

        //  INIT USER INFO
        if (userDataObj.userName === undefined) {
            userDataObj.userName = row.userName;
            userDataObj.parcels = [];
        }

        // INIT PARCEL IF NEEDED

        // init userDataObj.parcel[p]  if needed 
        let parcel = userDataObj.parcels.find(p => p.parcelName === row.parcelName);
        if (parcel === undefined) {
            // parcelName, parcelOwner, parcelCoord,

            parcel = new MonitoredParcel(row.parcelName, row.ownerName, { lat: row.parcelLat, lng: row.parcelLng });

            userDataObj.parcels.push(parcel);
        }


        // INIT YEAR IF NEEDED

        let sessionDate = new Date();
        sessionDate.setTime(row.sessionDateInSec + '000');
        // console.log("sessionDate "+sessionDate);

        let sessionYear = sessionDate.getFullYear();
        let year = parcel.parcelYears.find(y => y.yearNumber === sessionYear);
        if (year === undefined) {

            year = new MonitoredYear(sessionYear);

            parcel.parcelYears.push(year);
        }



        // INIT WEEK IF NEEDED

        // Compute session's WeekNumber from the first monday of the year
        let sessionFirstJan = new Date(sessionYear, 0, 1);
        // console.log("sessionFirstJan "+sessionFirstJan);

        let millisecsPerDay = 86400000;
        let sessionFirstJanTo1stMondayInMs = millisecsPerDay *
            ((sessionFirstJan.getDay() === 1) // monday
                ? 0
                : ((sessionFirstJan.getDay() === 0) // sunday 
                    ? 1
                    : 8 - sessionFirstJan.getDay())); //  (saturday 6 -- tuesday 2);

        let sessionFirstMondayOfYear = new Date();
        sessionFirstMondayOfYear.setTime(sessionFirstJan.getTime() + sessionFirstJanTo1stMondayInMs);
        // console.log("sessionFirstMondayOfYear "+sessionFirstMondayOfYear);

        let sessionWeekNumber = (sessionDate.getTime() === sessionFirstMondayOfYear.getTime()) ? 1
            : Math.ceil(((sessionDate.getTime() - sessionFirstMondayOfYear.getTime()) / millisecsPerDay) / 7);


        // Compute the Monday of the week corresponding to the session
        let sessionPrevMondayInMs = sessionDate.getTime() - millisecsPerDay *
            ((sessionDate.getDay() === 1) // monday
                ? 0
                : ((sessionDate.getDay() === 0) // sunday 
                    ? 6
                    : sessionDate.getDay() - 1)); //  (saturday 6 -- tuesday 2);

        let sessionDatePrevMonday = new Date();
        sessionDatePrevMonday.setTime(sessionPrevMondayInMs);
        let sessionDatePrevMondayLabel = "" + sessionDatePrevMonday.getDate() + " " + getMonthLabel(sessionDatePrevMonday.getMonth());
        // console.log("sessionDatePrevMonday "+sessionDatePrevMonday);

        let week = year.yearWeeks.find(w => w.weekNumber === sessionWeekNumber);
        if (week === undefined) {


            week = new MonitoredWeek(row.sessionDateInSec + '000');

            year.yearWeeks.push(week);
        }

        // ADD SESSION

        let session = week.weekSessions.find(s => s.sessionDateInMs === row.sessionDateInSec + '000');
        if (session === undefined) {
            session = new MonitoredSession(row.sessionDateInSec + '000');
            week.weekSessions.push(session);
        }


        // ADD OBSERVATION

        // userData = [ { obsVal, obsDate, obsLat, obsLng,  parcelName,  parcelSessionAvgGrowth,  parcelSessionDate,  parcelLat, parcelLng, userName}, ...]

        let obsv = new Observation(
            row.obsvLabel
            , row.obsvDateInMs
            , row.ownerName
            , row.oUserName
            , { lat: row.obsvLat, lng: row.obsvLng }
        );

        session.sessionObservations.push(obsv);


    });

    console.log('extracted userDataObj');
    console.log(userDataObj);

    return userDataObj
}

// For each parcel of userDataObj add the required years and weeks from startWeekNum to endWeekNum 
function addWeeksToUserDataObj(userDataObj, startYearNumber = 2018, endYearNumber = 2019, startWeekNumber = 22, endWeekNumber = 32) {

    // recall userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekSessions[sIdx].sessionObservations[oIdx]


    //  TODO  check that userDataObj  associated to at least one parcel (i.e., owner or viewer)


    console.log('addWeeksToUserDataObj ');

    if (userDataObj.parcels === undefined) {
        throw ' No parcels is currently monitored by the user';
        return;
    }


    // init list of valid year numbers that should appear in userDataObj
    let validYearNumbers = [];

    // init list of valid week numbers that should appear in userDataObj
    let validWeekNumbers = [];

    for (let pIdx = 0; pIdx < userDataObj.parcels.length; pIdx++) {

        var parcel = userDataObj.parcels[pIdx];
        // console.log('parcel ' + parcel.parcelName);


        // Computing valid years

        // add valid years found in userDataObj.parcels[pIdx]
        if (parcel.parcelYears !== undefined) {
            for (let yIdx = 0; yIdx < parcel.parcelYears.length; yIdx++) {
                let yNumber = parcel.parcelYears[yIdx].yearNumber;
                if (validYearNumbers.find(yN => yN === yNumber) === undefined) {
                    validYearNumbers.push(yNumber);
                    // console.log(' new validYearNumber ' +yN+ ' from parcel '+parcel);
                }
            }
        }

        // add valid years found between startYearNumber and endYearNumber
        for (let yNumber = startYearNumber; yNumber <= endYearNumber; yNumber++) {
            if (validYearNumbers.find(yN => yN === yNumber) === undefined) {
                validYearNumbers.push(yNumber);
                // console.log(' new validYearNumber ' +yNumber+ ' between '+startYearNumber+' and '+endYearNumber);
            }
        }



        // Computing valid weeks

        // add valid weeks found in userDataObj.parcels[pIdx]
        if (parcel.parcelYears !== undefined) {
            for (let yIdx = 0; yIdx < parcel.parcelYears.length; yIdx++) {
                if (parcel.parcelYears[yIdx].yearWeeks !== undefined) {
                    for (let wIdx = 0; wIdx < parcel.parcelYears[yIdx].yearWeeks.length; wIdx++) {
                        let wNumber = parcel.parcelYears[yIdx].yearWeeks[wIdx].weekNumber;
                        if (validWeekNumbers.find(wN => wN === wNumber) === undefined) {
                            validWeekNumbers.push(wNumber);
                        }
                    }
                }
            }
        }

        // add weeks found  between startWeekNumber and end weekNumbers
        for (let wNumber = startWeekNumber; wNumber <= endWeekNumber; wNumber++) {
            if (validWeekNumbers.find(wN => wN === wNumber) === undefined) {
                validWeekNumbers.push(wNumber);
            }
        }
        // console.log(' validWeekNumbers ' +validWeekNumbers);

    }

    // console.log('validYearNumbers ' + validYearNumbers);
    // console.log('validWeekNumbers ' + validWeekNumbers);

    // complete empty years and weeks in userDataObj

    for (let pIdx = 0; pIdx < userDataObj.parcels.length; pIdx++) {

        var parcel = userDataObj.parcels[pIdx];

        for (let yIdx = 0; yIdx < validYearNumbers.length; yIdx++) {
            let yN = validYearNumbers[yIdx];
            let year = parcel.parcelYears.find(y => y.yearNumber === yN);
            if (year === undefined) {
                year = new MonitoredYear(yN);
                parcel.parcelYears.push(year);
                console.log(' new year added ' + year + ' to ' + parcel);
            }
            // add year object if not in userDataObj


            for (let wIdx = 0; wIdx < validWeekNumbers.length; wIdx++) {
                let wN = validWeekNumbers[wIdx];
                let week = year.yearWeeks.find(w => w.weekNumber === wN);
                if (week === undefined) {
                    week = new MonitoredWeek(yN, wN);
                    year.yearWeeks.push(week);
                    // console.log(' new week '+week+' has been added to year '+year);
                }
            }

            // add year object if not in userDataObj

        }
    }

    console.log(' updated userDataObj');
    console.log(userDataObj);

}



function enforceConsistencyOfUserDataObj(userDataObj) {

    console.log(' enforceConsistencyOfUserDataObj ');


    if (userDataObj.parcels === undefined) {
        throw ' No parcels is currently monitored by the user';
    }

    for (let pIdx = 0; pIdx < userDataObj.parcels.length; pIdx++) {

        var parcel = userDataObj.parcels[pIdx];

        console.log(' parcelName '+parcel.parcelName);

        // Computing valid weeks


        // recall userDataObj.parcels[pIdx].parcelYears[yIdx].yearWeeks[wIdx].weekSessions[sIdx].sessionObservations[oIdx]

        // add valid weeks found in userDataObj.parcels[pIdx]
        if (parcel.parcelYears !== undefined && parcel.parcelYears.length>0 ) {
            for (let yIdx = 0; yIdx < parcel.parcelYears.length; yIdx++) {
                let year = parcel.parcelYears[yIdx];

                console.log(' yearNumber '+year.yearNumber);

                if (year.yearWeeks !== undefined && year.yearWeeks.length >0) {
                    for (let wIdx = 0; wIdx < year.yearWeeks.length; wIdx++) {
                        let week = year.yearWeeks[wIdx];

                        console.log(' weekNumber '+week.weekNumber);
                        
                        if(week.weekSessions !== undefined && week.weekSessions.length>0 ){
                            
                            // first level inferred parameters
                            let wNbObservations = 0;
                            let wSumGrowth = 0.0;
                            
                            let wNbObsFullGrowth = 0;
                            
                            let wNbObsSlowGrowth = 0;
                            
                            let wNbObsStoppedGrowth = 0;

                            // second level inferred param
                            this.weekICApex = 0;

                            for(let sIdx=0;sIdx<week.weekSessions.length;sIdx++){
                                let session = week.weekSessions[sIdx];
                                
                                let sSumGrowth = 0;
                                let sNbObs = 0;

                                if(session.sessionObservations !== undefined ){
                                    for(let oIdx=0;oIdx<session.sessionObservations.length;oIdx++){
                                        let obsv = session.sessionObservations[oIdx];

                                        if(obsv.obsvLabel === 'P'){
                                            wNbObsFullGrowth ++;
                                        }
                                                 
                                        if(obsv.obsvLabel ===  'R'){
                                            wNbObsSlowGrowth++;
                                        }
                                
                                        if(obsv.obsvLabel ===  'C'){
                                            wNbObsStoppedGrowth ++;
                                        }

                                        sSumGrowth += obsv.obsvValue;
                                        sNbObs++ ;

                                        wSumGrowth += obsv.obsvValue;
                                        wNbObservations++;
                                    }
                                    if(sNbObs>0){
                                        session.sessionAVGrowth = sSumGrowth/sNbObs;
                                    }

                                    
                                }
                            }
                            
                            week.weekNbObservations = wNbObservations;
                            week.weekAVGrowth = Math.round((wSumGrowth* 100.0)/wNbObservations)/100;

                            week.weekPrctFullGrowth = Math.round((wNbObsFullGrowth * 10000.0)/ (wNbObservations))/100; // 10000/100 =100 => result in percentage 
                            week.weekPrctSlowGrowth = Math.round((wNbObsSlowGrowth * 10000.0) / wNbObservations)/100;
                            week.weekPrctStoppedGrowth = Math.round((wNbObsStoppedGrowth * 10000.0)/ wNbObservations)/100;

                            week.weekICApex = week.reInitICApex();

                        }
                    }
                }
            }
        }
    }

    console.log(' updated userDataObj ');
    console.log(userDataObj);
}

function sortUserDataObjByYearByWeek(userDataObj) {
    // rearrange userDataObj by parcelName, years, weeks,

    if (userDataObj.parcels === undefined) {
        throw ' No parcels is currently monitored by the user';
    }

    for (let pIdx = 0; pIdx < userDataObj.parcels.length; pIdx++) {
        var parcel = userDataObj.parcels[pIdx];

        if (parcel.parcelYears !== undefined && parcel.parcelYears.length>0 ) {
            for (let yIdx = 0; yIdx < parcel.parcelYears.length; yIdx++) {
                let year = parcel.parcelYears[yIdx];

                if (year.yearWeeks !== undefined && year.yearWeeks.length>0) {
                    year.yearWeeks.sort((w1,w2) => w1.weekNumber - w2.weekNumber);
                }

            }
            parcel.parcelYears.sort((y1,y2)=> y1.yearNumber-y2.yearNumber );
        }

    }
    
    

}


function MonitoredParcel(pName, pOwner, pCoord) {
    this.parcelName = pName;
    this.parcelOwner = pOwner;
    this.parcelCoord = pCoord;
    this.parcelYears = [];

    this.toString = () => 'parcel:' + this.parcelName;
}

function MonitoredYear(yNumber) {
    this.yearNumber = yNumber;
    this.yearWeeks = [];

    this.toString = function () { return "y" + this.yearNumber; };
}


function MonitoredWeek(a, b) {


    // input properties
    this.weekNumber = 0 ;
    this.weekLabel = ""; // e.g. 10/02 - 17/02
    this.weekFullDate = new Date();
    this.weekSessions = [];

    // first level inferred properties
    this.weekNbObservations = 0;
    this.weekAVGrowth = 0;
    this.weekPrctFullGrowth = 0.0;
    this.weekPrctSlowGrowth = 0.0;
    this.weekPrctStoppedGrowth = 0.0;
    
    // second level inferred properties
    this.weekICApex = 0;
    
    

    this.toString = () => 'w' + this.weekNumber + '(' + this.weekLabel + ')';


    // Set up  weekNumber weekLabel weekFullDate

    if (b === undefined) {
        wFullDateInMs = a;

        console.log(" building MonitoredWeek with date in ms " + a);

        let sessionDate = new Date();
        sessionDate.setTime(wFullDateInMs);

        let sessionFirstJan = new Date(sessionDate.getFullYear(), 0, 1);

        let millisecsPerDay = 86400000;
        let sessionFirstJanTo1stMondayInMs = millisecsPerDay *
            ((sessionFirstJan.getDay() === 1) // monday
                ? 0
                : ((sessionFirstJan.getDay() === 0) // sunday 
                    ? 1
                    : 8 - sessionFirstJan.getDay())); //  (saturday 6 -- tuesday 2);

        let sessionFirstMondayOfYear = new Date();
        sessionFirstMondayOfYear.setTime(sessionFirstJan.getTime() + sessionFirstJanTo1stMondayInMs);
        // console.log("sessionFirstMondayOfYear "+sessionFirstMondayOfYear);

        let sessionWeekNumber = (sessionDate.getTime() === sessionFirstMondayOfYear.getTime()) ? 1
            : Math.ceil(((sessionDate.getTime() - sessionFirstMondayOfYear.getTime()) / millisecsPerDay) / 7);


        // Compute the Monday of the week corresponding to the session
        let sessionPrevMondayInMs = sessionDate.getTime() - millisecsPerDay *
            ((sessionDate.getDay() === 1) // monday
                ? 0
                : ((sessionDate.getDay() === 0) // sunday 
                    ? 6
                    : sessionDate.getDay() - 1)); //  (saturday 6 -- tuesday 2);

        let sessionDatePrevMonday = new Date();
        sessionDatePrevMonday.setTime(sessionPrevMondayInMs);
        let sessionDatePrevMondayLabel = "" + sessionDatePrevMonday.getDate() + " " + getMonthLabel(sessionDatePrevMonday.getMonth());
        // console.log("sessionDatePrevMonday "+sessionDatePrevMonday);


        this.weekNumber = sessionWeekNumber;
        this.weekLabel = sessionDatePrevMondayLabel; // e.g. 10/02 - 17/02
        this.weekFullDate = sessionDatePrevMonday.toString();
        

    } else {
        yNumber = a;
        wNumber = b;

        console.log("building MonitoredWeek with yearNumber: " + yNumber + " and wNumber " + b);

        let sessionFirstJan = new Date(yNumber, 0, 1);
        let millisecsPerDay = 86400000;
        let sessionFirstJanTo1stMondayInMs = millisecsPerDay *
            ((sessionFirstJan.getDay() === 1) // monday
                ? 0
                : ((sessionFirstJan.getDay() === 0) // sunday 
                    ? 1
                    : 8 - sessionFirstJan.getDay())); //  (saturday 6 -- tuesday 2);

        let sessionFirstMondayOfYear = new Date();
        sessionFirstMondayOfYear.setTime(sessionFirstJan.getTime() + sessionFirstJanTo1stMondayInMs);

        let wFullDateInMs = sessionFirstMondayOfYear.getTime() + (millisecsPerDay * 7 * (wNumber - 1));
        let wFullDate = new Date();
        wFullDate.setTime(wFullDateInMs);
        let wFullDateLabel = "" + wFullDate.getDate() + " " + getMonthLabel(wFullDate.getMonth());

        this.weekNumber = wNumber;
        this.weekLabel = wFullDateLabel; // e.g. 10/02 - 17/02
        this.weekFullDate = wFullDate.toString();

    }

    

    this.reInitICApex = function(){
        // this.weekAVGrowth and this nbObservations should be reinit first
        var hydricConstraint = 3;
        if (this.weekAVGrowth >= 0.75) {
            hydricConstraint = 0;
        } else {
            if (this.weekPrctFullGrowth >= 5) {
                hydricConstraint = 1;
            } else {
                if (this.weekPrctSlowGrowth <= 90) {
                    hydricConstraint = 2;
                }
            }
        }
        return hydricConstraint;
    };


}





function MonitoredSession(sDateInMs) {
    let sessionDate = new Date();
    sessionDate.setTime(sDateInMs);

    this.sessionDateInMs = sDateInMs;
    this.sessionDateLabel = "" + sessionDate.getDate() + " " + getMonthLabel(sessionDate.getMonth()) + " " + sessionDate.getFullYear();
    this.sessionAVGrowth = 0;
    this.sessionICApex = 0;
    this.sessionObservations = [];
}


function Observation(oLabel, oDateInMs, oOwnerName, oUserName, oCoord) {

    this.initObsvValueFromLabel = function (apexLabel) {
        switch (apexLabel) {
            case 'P':
                return 1;
    
            case 'R':
                return 0.5;
    
            case 'C':
                return 0;
            default:
                return undefined;
        }
    }


    this.obsvLabel = oLabel;
    this.obsvValue = this.initObsvValueFromLabel(oLabel);
    this.obsvDateInMs = oDateInMs;
    this.obsvOwnerName = oOwnerName;
    this.obsvUserName = oUserName;
    this.obsvCoord = oCoord;


    
}

// function extractParcels(userDBRows) {
//     let parcels = [];
//     userDBRows.forEach(e => {
//         // init parcels
//         if (parcels.find(p => (p.name === e.parcelName)) === undefined) {
//             parcels.push({
//                 name: e.parcelName
//                 , coord: { lat: e.parcelLat, lng: e.parcelLng }
//             });
//         }
//     });
//     parcels.sort((p1, p2) => p1.coord.lng - p2.coord.lng);

//     return parcels;
// }

// function extractYears(userDBRows) {
//     let years = [];
//     userDBRows.forEach(e => {
//         // init session date 
//         let sessionDate = new Date();
//         sessionDate.setTime(e.sessionDate + '000');
//         // init session year
//         let sessionYear = sessionDate.getFullYear();
//         // add year if not present
//         if (years.find(y => y === sessionYear) === undefined) {
//             years.push(sessionYear);
//         }

//     });
//     years.sort(y1, y2 => y1 - y2);
//     return years;
// }