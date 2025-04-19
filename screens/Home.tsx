import React from "react";
import Layout01 from "../layouts/Layout01/Layout01";
import Button from "../components/Button/Button";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import styled, {css, useTheme} from "styled-components/native";
import Label from "../components/Label/Label";
import BaseCard from "../components/BaseCard/BaseCard";
import TotalCard from "../components/TotalCard/TotalCard";


const Style_BottomAction = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: auto;
`

const Style_CardContainer = styled.View`
  display: flex;
  ${({ theme }) => css`
    gap: ${(theme.size.s.value / 1.5) * 16}px;
  `}
`

const Home = () => {
  const theme = useTheme();

  return (
    <Layout01>
      <TotalCard />
      <Style_CardContainer>
        <Label size="s" color="textSecondary">
          Fixe Kosten
        </Label>
        <BaseCard>

        </BaseCard>
      </Style_CardContainer>
      <Style_CardContainer>
        <Label size="s" color="textSecondary">
          Buchungen
        </Label>
        <BaseCard>

        </BaseCard>
      </Style_CardContainer>
      <Style_BottomAction>
        <Button type="primary" padding="l">
          <FontAwesomeIcon
            color={theme.color.surface}
            size={theme.size.l.value * 16}
            icon="pen"
          />
        </Button>
      </Style_BottomAction>
    </Layout01>
  );
};

export default Home;