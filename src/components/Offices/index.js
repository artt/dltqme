import React from "react"
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

export default function Offices({ allOffices, offices, setOffices }) {

  const [value, setValue] = React.useState("")
  const [sort, setSort] = React.useState(false)

  const handleToggle = (office_id) => () => {
    if (offices.includes(office_id)) {
      setOffices(offices.filter(o => o !== office_id))
    }
    else {
      setOffices(offices.concat(office_id))
    }
  }

  function handleChange(str) {
    setValue(str)
  }

  return(
    <div className="offices">
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          id="search"
          label="Search"
          variant="standard"
          value={value}
          onChange={e => handleChange(e.target.value)}
          type="search"
          sx={{ flex: 1 }}
          autoComplete="off"
          InputProps={value !== ""
            ? {
                endAdornment: (
                  <IconButton
                    onClick={() => {
                      handleChange("")
                      document.getElementById("search").focus()
                    }}
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                )
              }
            : null
          }
        />
        <ToggleButton
          value="check"
          size="small"
          selected={sort}
          onChange={() => {
            setSort(!sort);
          }}
        >
          <FilterListIcon />
        </ToggleButton>
      </Stack>
      <div className="list-container">
        <List sx={{ width: '100%', boxSizing: 'border-box', minHeight: '100%', bgcolor: 'background.paper' }}>
          {sort && allOffices.filter(o => o.office_name.includes(value) && offices.includes(o.office_id)).map((office, i) => {
            const labelId = `checkbox-list-label-${i}`;
            return (
              <ListItem
                key={office.office_id}
                disablePadding
              >
                <ListItemButton role={undefined} onClick={handleToggle(office.office_id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={offices.includes(office.office_id)}
                      tabIndex={-1}
                      disableRipple
                      sx={{ p: 0.5 }}
                      size="small"
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={office.office_name} />
                </ListItemButton>
              </ListItem>
            );
          })}
          {sort && <Divider />}
          {allOffices.filter(o => o.office_name.includes(value) && (!sort || !offices.includes(o.office_id))).map((office, i) => {
            const labelId = `checkbox-list-label-${i}`;
            return (
              <ListItem
                key={office.office_id}
                disablePadding
              >
                <ListItemButton role={undefined} onClick={handleToggle(office.office_id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={offices.includes(office.office_id)}
                      tabIndex={-1}
                      disableRipple
                      sx={{ p: 0.5 }}
                      size="small"
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={office.office_name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </div>
    </div>
  )

}