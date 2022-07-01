import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Results({ allOffices, data, optChanged }) {

  const medium = useMediaQuery('(min-width:500px)');
  const wide = useMediaQuery('(min-width:1300px)');

  // eslint-disable-next-line
  const officeNames = allOffices.reduce((obj, item) => (obj[item.office_id] = item.office_name, obj) ,{});
  // https://stackoverflow.com/questions/19874555/how-do-i-convert-array-of-objects-into-one-object-in-javascript
  
  const TimeSlots = ({ data }) => (
    <div style={{ color: 'lightgrey' }}>
      {data.map((slot, j) => (
        <span style={{margin: '0 4px'}} key={`slot-${j}`}>{slot.round}</span>
      ))}
    </div>
  ) 

  return(
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: '100%',
        minHeight: '100%',
        overflowX: 'hidden'
      }}
    >
      <Table
        stickyHeader
        size="small"
        aria-label="results table"
        sx={{
          maxHeight: '100%',
          minHeight: '100%',
          bgcolor: (optChanged ? 'rgba(40, 10, 10, 0.2)' : 'background.paper')
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ minWidth: '80px' }}>วันที่</TableCell>
            {medium && <TableCell align="center">สำนักงาน</TableCell>}
            {wide && <TableCell align="center">เวลา</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(data).sort().map(date => {
            const v = data[date]
            if (wide || medium) {
              return(
                <React.Fragment key={date}>
                {v.map((office, i) => (
                  <TableRow key={`${date}-${i}`}>
                    {i === 0 &&
                      <TableCell rowSpan={v.length} align="center">{date}</TableCell>
                    }
                    {wide
                    ? <>
                        <TableCell>{officeNames[office.office_id]}</TableCell>
                        <TableCell>
                          <TimeSlots data={office.slots} />
                        </TableCell>
                      </>
                    : <TableCell>
                        <div>{officeNames[office.office_id]}</div>
                        <TimeSlots data={office.slots} />
                      </TableCell>
                    }
                  </TableRow>
                ))}
                </React.Fragment>
              )
            }
            else {
              return(
                <TableRow key={`${date}`}>
                  <TableCell sx={{ p: 2 }}>
                    <div style={{ marginBottom: '0.5rem' }}>{date}</div>
                    {v.map(office => (
                      <div key={`${date}-${office.office_id}`} style={{ margin: '0.5rem' }}>
                        <div>{officeNames[office.office_id]}</div>
                        <TimeSlots data={office.slots} />
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              )
            }
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )

}