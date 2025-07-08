import React from 'react'
import { BtnPanelControl } from '../../Components/BtnPanelControl/BtnPanelControl'

export const SuperiorPanel = () => {
  return (
    <div>
        <div className="space-x-60 flex">
            <BtnPanelControl color="purple" content="Dia" />
            <BtnPanelControl color="slate" content="Semana" />
            <BtnPanelControl color="rose" content="Mes" />
            <BtnPanelControl color="teal" content="Año" />
        </div>
    </div>
  )
}
