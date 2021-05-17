const filterByYearAndWeek = ({year, week, records, fieldWeek, fieldYear}) => records.filter(record => {
    const weekValue = record.getCellValue(fieldWeek);
    const yearValue = record.getCellValue(fieldYear);
    return Number(weekValue) === Number(week) && Number(yearValue) === Number(year);
});

output.markdown('# Calculation SLA\'s');
const week = await input.textAsync('set the week number you want to calculate');
const year = await input.textAsync('set the year you want to calculate');

const table = base.getTable("tblZYYFsZQJ6I4oZi");
const table2 = base.getTable("tblj1rVzLXAciEZPm"); //[Eng] SLA bugs
const table3 = base.getTable("tbl5y1kRZguUwXMb5"); //[Eng] SLA  tasks

if (Number(week) && Number(year) > 2000) {
    const bugsAndTaks = base.getTable("tblZYYFsZQJ6I4oZi");
    const query = await bugsAndTaks.selectRecordsAsync({
        sorts: [
            {field: "ResolvedYear", direction: 'asc'},
            {field: "ResolvedWeek", direction: 'asc'}
        ]
    });
    const filterRecords = filterByYearAndWeek({
        year, 
        week, 
        records: query.records, 
        fieldWeek: "ResolvedWeek",
        fieldYear: "ResolvedYear"
    });
    
    const slaAcumData = query.records.reduce((acum, record) => {
        try {
            const sla = record.getCellValue("SLA");
            const resolvedWeek = record.getCellValue("ResolvedWeek");
            const resolvedYear = record.getCellValue("ResolvedYear");
            const createdWeek = record.getCellValue("CreatedWeek");
            const createdYear = record.getCellValue("CreatedYear");
            const priority = record.getCellValue("Priority");
            const issueType = record.getCellValue('Issue Type').name;
                        
            if (resolvedWeek === null || resolvedYear === null) {
                return acum;
            };
            
            if (!resolvedWeek){
                return acum;
            }
            const defaultObject = {
                total: 0, 
                value: 0, 
                year: 0, 
                week: 0, 
                'Highest': {total:0, value: 0, created: 0}, 
                'High': {total:0, value: 0, created: 0}, 
                'Medium': {total:0, value: 0, created: 0}, 
                'Low': {total:0, value: 0, created: 0}, 
                'Lowest': {total:0, value: 0, created: 0}
            };
            acum[issueType][`${resolvedYear}_${resolvedWeek}`] = acum[issueType][`${resolvedYear}_${resolvedWeek}`] ? acum[issueType][`${resolvedYear}_${resolvedWeek}`] : defaultObject;
            acum[issueType][`${createdYear}_${createdWeek}`] = acum[issueType][`${createdYear}_${createdWeek}`] ? acum[issueType][`${createdYear}_${createdWeek}`] : defaultObject;
            acum[issueType][`${resolvedYear}_${resolvedWeek}`].total += 1;
            acum[issueType][`${createdYear}_${createdWeek}`][priority.name].created += 1;
            acum[issueType][`${resolvedYear}_${resolvedWeek}`][priority.name].total += 1;
            acum[issueType][`${resolvedYear}_${resolvedWeek}`][priority.name].value += sla; 
            acum[issueType][`${resolvedYear}_${resolvedWeek}`].value += sla; 
            acum[issueType][`${resolvedYear}_${resolvedWeek}`].week = resolvedWeek;
            acum[issueType][`${resolvedYear}_${resolvedWeek}`].year = resolvedYear; 
        }
        catch (err) {
        }
    
        return acum;
    },{Bug: {}, Task:{}});

    for (let e in slaAcumData.Bug) {
        try{
            await table2.createRecordAsync({
                year: Number(slaAcumData.Bug[e].year),
                week: Number(slaAcumData.Bug[e].week),
                TotalBugsClosed: slaAcumData.Bug[e].total,
                AverageDaysToClose: slaAcumData.Bug[e].value,
                HighestTotalClosed: slaAcumData.Bug[e].Highest.total,
                AverageDaysToCloseHighest: slaAcumData.Bug[e].Highest.total ? slaAcumData.Bug[e].Highest.value / slaAcumData.Bug[e].Highest.total : 0,
                HighTotalClosed: slaAcumData.Bug[e].High.total,
                AverageDaysToCloseHigh: slaAcumData.Bug[e].High.total ? slaAcumData.Bug[e].High.value / slaAcumData.Bug[e].High.total : 0,
                MediumTotalClosed: slaAcumData.Bug[e].Medium.total,
                AverageDaysToCloseMedium: slaAcumData.Bug[e].Medium.total ? slaAcumData.Bug[e].Medium.value / slaAcumData.Bug[e].Medium.total : 0,
                LowTotalClosed: slaAcumData.Bug[e].Low.total,
                AverageDaysToCloseLow: slaAcumData.Bug[e].Low.total ? slaAcumData.Bug[e].Low.value / slaAcumData.Bug[e].Low.total : 0,
                LowestTotalClosed: slaAcumData.Bug[e].Lowest.total,
                AverageDaysToCloseLowest: slaAcumData.Bug[e].Lowest.total ? slaAcumData.Bug[e].Lowest.value / slaAcumData.Bug[e].Lowest.total : 0,
                HighestTotalCreated: slaAcumData.Bug[e].Highest.created,
                HighTotalCreated: slaAcumData.Bug[e].High.created,
                MediumTotalCreated: slaAcumData.Bug[e].Medium.created,
                LowTotalCreated: slaAcumData.Bug[e].Low.created,
                LowestTotalCreated: slaAcumData.Bug[e].Lowest.created
            });
        } catch (e) {
            console.log(e);
        }
    }

    for (let e in slaAcumData.Task) {
        try {
            await table3.createRecordAsync({
                year: Number(slaAcumData.Task[e].year),
                week: Number(slaAcumData.Task[e].week),
                TotalBugsClosed: slaAcumData.Task[e].total,
                AverageDaysToClose: slaAcumData.Task[e].value,
                HighestTotalClosed: slaAcumData.Task[e].Highest.total,
                AverageDaysToCloseHighest: slaAcumData.Task[e].Highest.total ? slaAcumData.Task[e].Highest.value / slaAcumData.Task[e].Highest.total : 0,
                HighTotalClosed: slaAcumData.Task[e].High.total,
                AverageDaysToCloseHigh: slaAcumData.Task[e].High.total ? slaAcumData.Task[e].High.value / slaAcumData.Task[e].High.total : 0,
                MediumTotalClosed: slaAcumData.Task[e].Medium.total,
                AverageDaysToCloseMedium: slaAcumData.Task[e].Medium.total ? slaAcumData.Task[e].Medium.value / slaAcumData.Task[e].Medium.total : 0,
                LowTotalClosed: slaAcumData.Task[e].Low.total,
                AverageDaysToCloseLow: slaAcumData.Task[e].Low.total ? slaAcumData.Task[e].Low.value / slaAcumData.Task[e].Low.total : 0,
                LowestTotalClosed: slaAcumData.Task[e].Lowest.total,
                AverageDaysToCloseLowest: slaAcumData.Task[e].Lowest.total ? slaAcumData.Task[e].Lowest.value / slaAcumData.Task[e].Lowest.total : 0,
                HighestTotalCreated: slaAcumData.Task[e].Highest.created,
                HighTotalCreated: slaAcumData.Task[e].High.created,
                MediumTotalCreated: slaAcumData.Task[e].Medium.created,
                LowTotalCreated: slaAcumData.Task[e].Low.created,
                LowestTotalCreated: slaAcumData.Task[e].Lowest.created
            });
        } catch (e) {
            console.log(e);
        }
    }
}

console.log(table2, table3)
