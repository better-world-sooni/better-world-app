import React from "react"
import { Col } from "src/components/common/Col"
import { Div } from "src/components/common/Div"
import { Row } from "src/components/common/Row"
import { Span } from "src/components/common/Span"
import { Style } from "src/components/common/Style"
import { TextInput  } from "src/modules/viewComponents"

export const TextField = (props) => {
  const {
    label,
    labelStyle,
    note,
    error,
    mt = 16,
    value,
    onChangeText,
    disabled,
    placeHolder,
    password,
    leftComp,
    rightComp,
    ...others
  } = props
  return (
    <Div w="100%" mt={mt}>
      <Span header6 black styleComp={labelStyle}>
        {label}
      </Span>
      <Row itemsCenter mt4>
        {leftComp &&
          <Col auto>
            {leftComp}
          </Col>
        }
        <Col>
          <TextInput
            h52
            border borderGray400
            rounded4
            p16
            {...others}
            styleComp={[
              <Style borderDanger isActive={error} />,
              <Style border={0} bgGray200 isActive={disabled} />,
            ]}
            editable={!disabled}
            secureTextEntry={password}
            placeholder={placeHolder}
            onChangeText={onChangeText}
            value={value}
          />
        </Col>
        {rightComp &&
          <Col auto>
            {rightComp}
          </Col>
        }
      </Row>
      {error ?
        <Span noticeDetail danger mt2>
          {error}
        </Span>
        : (note &&
          <Span noticeDetail gray600 mt2>
            {note}
          </Span>
        )
      }
    </Div>
  )
}