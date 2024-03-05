import { Box } from '@mantine/core';
import React from 'react';
import classes from './Map.module.css';
import { useMap } from '@/context/Map';
import { useMediaQuery } from '@mantine/hooks';
import { cssHalfMainSize, cssMainSize } from '@/theme';

function Map() {
  const sm = useMediaQuery('(max-width: 48em)');
  const { center, markers, setCenter } = useMap();

  return (
    <Box className={classes.box}>
    </Box>
  );
}

export default Map;
