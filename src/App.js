import React from "react";
import './App.css';
import Offices from './components/Offices';
import Results from './components/Results';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import darkScrollbar from '@mui/material/darkScrollbar';
import GlobalStyles from '@mui/material/GlobalStyles';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import QRPromptPaySVG from './qr-promptpay.svg';
import LoadingButton from '@mui/lab/LoadingButton';
import TagManager from 'react-gtm-module'
import Div100vh from 'react-div-100vh'
import CircularProgress from '@mui/material/CircularProgress';

const tagManagerArgs = {
    gtmId: 'G-NKZXF8HPWS'
}

TagManager.initialize(tagManagerArgs)

const MAX_OFFICES = 10

export default function App() {

  const theme = createTheme({
    typography: {
      fontFamily: `"IBM Plex Sans Thai"`,
    },
    palette: {
      mode: 'dark',
    },
  })

  const small = useMediaQuery('(max-width:500px)');
  const onecol = useMediaQuery('(max-width:890px)');

  const [allOffices, setAllOffices] = React.useState([])
  const [offices, setOffices] = React.useState([1, 2, 3, 4, 5])
  const [results, setResults] = React.useState([])
  const [optChangeType, setOptChangeType] = React.useState(false)
  const [optOldExpire, setOptOldExpire] = React.useState(false)
  const [optOnline, setOptOnline] = React.useState(true)
  const [aboutOpen, setAboutOpen] = React.useState(false)
  const [resultsOpen, setResultsOpen] = React.useState(false)
  const [status, setStatus] = React.useState('ready')
  const [latestFetch, setLatestFetch] = React.useState({})
  const [optChanged, setOptChanged] = React.useState(true)

  React.useMemo(() => {
    return fetch(`https://dltqme.herokuapp.com/list-offices`)
      .then(res => res.json())
      .then(res => setAllOffices(res))
  }, [])

  const areSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

  React.useEffect(() => {
    if (optChangeType !== latestFetch.optChangeType
      || optOldExpire !== latestFetch.optOldExpire
      || optOnline !== latestFetch.optOnline
      || !areSetsEqual(new Set(latestFetch.offices), new Set(offices))
    ) {
      setOptChanged(true)
    }
    else {
      setOptChanged(false)
    }
  }, [latestFetch, offices, optChangeType, optOldExpire, optOnline])

  function doMagic() {
    if (offices.length > MAX_OFFICES) {
      alert(`จำนวนสำนักงานที่เลือกเกิน ${MAX_OFFICES} ระบบจะประมวลผลเพียง ${MAX_OFFICES} แรกเท่านั้น`)
    }
    setStatus('fetching')
    fetch(`https://dltqme.herokuapp.com/work`, {
      method: "POST",
      body: JSON.stringify({
        offices: offices.slice(0, MAX_OFFICES),
        optChangeType: optChangeType,
        optOldExpire: optOldExpire,
        optOnline: optOnline,
      })
    })
      .then(res => res.json())
      .then(res => {
        setResults(res)
        setStatus('ready')
        onecol && setResultsOpen(true)
        setOptChanged(false)
        setLatestFetch({
          offices: offices,
          optChangeType: optChangeType,
          optOldExpire: optOldExpire,
          optOnline: optOnline,
        })
      })
  }

  const clearOffices = () => setOffices([])
  const handleAboutClose = () => setAboutOpen(false)
  const openResults = () => setResultsOpen(true)
  const handleResultsClose = () => setResultsOpen(false)

  if (allOffices.length === 0) {
    return <Div100vh><div className="all-loading"><CircularProgress /></div></Div100vh>
  }

  return (
    <Div100vh>
      <GlobalStyles styles={{ ...darkScrollbar() }} />
      <ThemeProvider theme={theme}>
        <div className="App">
          <div className="sidebar">
            <div className="title" onClick={() => setAboutOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path style={{ fill: "white" }} d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"/></svg>
            </div>
            <div className="options">
              <FormGroup sx={{ maxWidth: '250px', margin: '0 auto' }}>
                <FormControlLabel control={<Switch size="small" checked={optChangeType} onChange={() => setOptChangeType(!optChangeType)} />} label="บัตรเดิมเป็นแบบ 2 ปี" />
                <FormControlLabel control={<Switch size="small" checked={optOldExpire} onChange={() => setOptOldExpire(!optOldExpire)} />} label="บัตรเดิมหมดอายุเกิน 1 ปีแล้ว" />
                <FormControlLabel control={<Switch size="small" checked={optOnline} onChange={() => setOptOnline(!optOnline)} />} label="อบรมแบบ e-learning" />
              </FormGroup>
            </div>
            <Offices allOffices={allOffices} offices={offices} setOffices={setOffices} />
            <div className="button">
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                {!small && <Button variant="text" onClick={() => setAboutOpen(true)}>About</Button>}
                <div style={{ flex: 1 }} />
                <Button variant="text" onClick={clearOffices} color="warning">Clear</Button>
                <LoadingButton
                  onClick={doMagic}
                  disabled={offices.length === 0}
                  loading={status === 'fetching'}
                  variant="contained"
                >
                  Queue Me!
                </LoadingButton>
                {onecol && <Button variant={optChanged ? "outlined" : "contained"} onClick={openResults} color="success">Results</Button>}
              </Stack>
            </div>
          </div>
          {!onecol &&
            <div className="results">
              <Results allOffices={allOffices} data={results} optChanged={optChanged} />
            </div>
          }
        </div>
        <Dialog
          open={resultsOpen}
          onClose={handleResultsClose}
          fullScreen={onecol}
        >
          <DialogContent sx={{ p: 0 }}>
            <div className="results">
              <Results allOffices={allOffices} data={results} optChanged={optChanged} />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleResultsClose} autoFocus>เคอ่ะ</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={aboutOpen}
          onClose={handleAboutClose}
          fullScreen={small}
        >
          <DialogTitle>
            {"DLT, Queue Me!"}
          </DialogTitle>
          <DialogContent>
            <p>
              เวลาต้องหาเวลานัดต่อใบขับขี่ รู้สึกว่าการหา slot เวลาจะยากเหลือเกิน ที่มีอยู่ก็ไปอีกตั้ง 2–3 เดือน
              แต่ก็จะมีบางทีที่มีคน cancel เวลาใกล้ ๆ ทำให้มี slot ว่างขึ้นมา
              ทำให้ต้องคอยมาเช็คอยู่เรื่อย ๆ
            </p>
            <p>
              จริง ๆ <a href="https://gecc.dlt.go.th/" target="_blank" rel="noopener noreferrer">ระบบของกรมการขนส่งทางบก</a>ก็โอเคอยู่ แต่ user interface อาจจะใช้ยากและทำให้ช้านิดนึง
              เว็บนี้จึงเกิดขึ้นมาเพื่ออำนวยความสะดวก โดยจะไปหา slot ว่างที่มีอยู่ของสำนักงานสาขาต่าง ๆ ณ ขณะนั้นมาให้
              (สำหรับรถยนต์ส่วนบุคคลเท่านั้น)
              โดยใช้ API ของกรมการขนส่งนั่นแหละ ยังไงถ้าเจ้าหน้าที่กรมการขนส่งมาเห็น จะหยิบไปปรับแอป DLT Smart Queue ก็ยินดีนะครับ
            </p>
            <p>
              หรือถ้าใครคิดว่าอันนี้ดีย์ ก็ช่วยออกค่ากาฟงกาแฟหน่อยจะขอบคุณมากนะครับ (PromptPay QR ด้านล่าง ^^)
            </p>
            <img src={QRPromptPaySVG} alt="QR code for PromptPay" width="150" style={{ margin: '0 auto', display: 'block' }} />
            <p>
              สุดท้ายนี้ อย่าลืมว่าเราสามารถต่อใบขับขี่ก่อนใบขับขี่หมดอายุได้ตั้ง 6 เดือนแน่ะ อย่าลืมไปต่อกันแต่เนิ่น ๆ นะ
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAboutClose} autoFocus>เคอ่ะ</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </Div100vh>
  );

}
