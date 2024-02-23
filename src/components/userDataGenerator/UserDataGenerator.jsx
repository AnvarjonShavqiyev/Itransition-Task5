import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import UserTable from "../userTable/UserTable";
import faker from "faker";
import "./UserDataGenerator.scss";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";

const Input = styled(MuiInput)`
  width: 42px;
`;

const UserDataGenerator = () => {
  const [region, setRegion] = useState("tr");
  const [errorPerRecord, setErrorPerRecord] = useState(0);
  const [seed, setSeed] = useState(0);
  const [userData, setUserData] = useState([]);
  const [maxScroll, setMaxScroll] = useState(0);

  const handleSliderChange = (event, newValue) => {
    newValue > 10 ? setErrorPerRecord(0) : setErrorPerRecord(newValue);
  };
  const fSetSeed = (e) => {
    e.target.value.length <= 0 ? setSeed(0) : setSeed(+e.target.value);
  };
  const handleInputChange = (event) => {
    setErrorPerRecord(
      event.target.value === "" ? 0 : Number(event.target.value)
    );
  };
  const handleBlur = () => {
    if (errorPerRecord < 0) {
      setErrorPerRecord(0);
    } else if (errorPerRecord > 1000) {
      setErrorPerRecord(1000);
    }
  };
  const handleChange = (event) => {
    setRegion(event.target.value);
    setUserData([]);
    setMaxScroll(0);
  };
  const generateRandomData = () => {
    const newData = Array.from({ length: 20 }, (_, index) => {
      return {
        index: index + 1,
        randomIdentifier: faker.datatype.uuid(),
        name: faker.name.findName(),
        address: faker.address.streetAddress(),
        phone: faker.phone.phoneNumber(),
      };
    });

    setUserData(newData);
  };
  const addData = () => {
    faker.seed(seed);
    faker.locale = region;
    const newData = Array.from({ length: 20 }, (_, index) => {
      return {
        index: index + 1,
        randomIdentifier: faker.datatype.uuid(),
        name: faker.name.findName(),
        address: faker.address.streetAddress(),
        phone: faker.phone.phoneNumber(),
      };
    });
    setUserData([...userData, ...newData]);
  };
  const makeError = () => {
    let errorList = [
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "{",
      "}",
      "[",
      "]",
      "<",
      ">",
      "?",
      "/",
      "+",
      "-",
    ];
    userData.map((user) => {
      for (let i = 0; i < errorPerRecord; i++) {
        let fullInfo = user.name + "," + user.address + "," + user.phone;
        fullInfo = fullInfo.split(" ").join("");
        let changeIndex = Math.floor(Math.random() * fullInfo.length);
        let errorIndex = Math.floor(Math.random() * errorList.length);
        fullInfo = fullInfo.split("");
        fullInfo[changeIndex] === ","
          ? (fullInfo[changeIndex + 1] = errorList[errorIndex])
          : (fullInfo[changeIndex] = errorList[errorIndex]);
        fullInfo = fullInfo.join("").split(",");
        user.name = fullInfo[0];
        user.address = fullInfo[1];
        user.phone = fullInfo[2];
      }
      return user;
    });
  };

  useEffect(() => {
    faker.seed(seed);
    faker.locale = region;
    generateRandomData();
  }, [region, seed]);

  useEffect(() => {
    makeError();
  }, [errorPerRecord]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > maxScroll) {
        setMaxScroll(window.scrollY);
        addData();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [maxScroll]);

  return (
    <div className="generator-wrappers">
      <div className="controllers-wrapper">
        <Box sx={{ width: "100px", height: "20px" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Region</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={region}
              label="Region"
              onChange={handleChange}
            >
              <MenuItem value="tr">Turkey</MenuItem>
              <MenuItem value="ru">Russia</MenuItem>
              <MenuItem value="en">USA</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: 250 }}>
          <Typography id="input-slider" gutterBottom>
            Errors
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Slider
                value={typeof errorPerRecord === "number" ? errorPerRecord : 0}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
                step={1}
                min={0}
                max={10}
              />
            </Grid>
            <Grid item>
              <Input
                value={errorPerRecord}
                size="small"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: 1,
                  min: 0,
                  max: 1000,
                  type: "number",
                  "aria-labelledby": "input-slider",
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <label className="seed" htmlFor="seed">
          Seed:
          <input
            type="text"
            className="seed-input"
            id="seed"
            value={seed}
            onChange={(e) => fSetSeed(e)}
          />
        </label>
        <button className="generate-btn" onClick={generateRandomData}>
          Generate
        </button>
      </div>
      <UserTable userData={userData} />
    </div>
  );
};

export default UserDataGenerator;
