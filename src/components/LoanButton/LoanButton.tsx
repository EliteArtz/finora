import React, { useState } from 'react';
import Button from '../Button/Button';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';
import AddLoanModal from "../../modals/AddLoanModal/AddLoanModal";

const LoanButton = () => {
  const [ isModalVisible, setIsModalVisible ] = useState(false);

  const onPress = () => setIsModalVisible(true);

  return (
    <>
      <Button type="primary" padding="l" onPress={onPress}>
        <FontAwesomeIcon
          color="textPrimary"
          size="l"
          icon="pen"
        />
      </Button>
      <AddLoanModal isVisible={isModalVisible} setIsVisible={setIsModalVisible} />
    </>
  );
};

export default LoanButton;