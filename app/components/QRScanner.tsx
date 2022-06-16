import React from 'react'
import PropTypes from 'prop-types'
import { BrowserCodeReader, BrowserQRCodeReader, IScannerControls } from '@zxing/browser'

export type QRScannerProps = {
  resultSetter: React.Dispatch<React.SetStateAction<string>>
  afterScan?: () => void
  showReset?: boolean
}

export type QRScannerState = {
  selectedDevice: string
  reader: BrowserQRCodeReader
  currentControls?: IScannerControls
}

export default class QRScanner extends React.Component<QRScannerProps, QRScannerState> {
  static get propTypes () {
    return {
      resultSetter: PropTypes.func,
      afterScan: PropTypes.func,
      showReset: PropTypes.bool
    }
  }

  public readonly state: QRScannerState

  resultSetter: React.Dispatch<React.SetStateAction<string>>
  afterScan: () => void
  showReset: boolean

  constructor (props: QRScannerProps) {
    super(props)

    this.resultSetter = props.resultSetter
    this.afterScan = props.afterScan ?? (() => { })
    this.showReset = props.showReset ?? false

    this.state = {
      selectedDevice: '',
      reader: new BrowserQRCodeReader(),
      currentControls: undefined
    }
  }

  private runScanner () {
    const self = this
    self.resultSetter('')

    // Update controls helper.
    const updateControls = (newC?: IScannerControls) => {
      self.setState((state, _) => {
        return {
          selectedDevice: state.selectedDevice,
          reader: state.reader,
          currentControls: newC
        }
      })
    }

    // Read a new result.
    const run = async () => {
      const controls = await self.state.reader.decodeFromVideoDevice(
        self.state.selectedDevice, 'scanner-preview',
        (result, _, controls) => {
          const afterAll = () => {
            self.afterScan()
            controls.stop()

            updateControls(undefined)
          }

          if (result) {
            self.resultSetter(result.getText())
            afterAll()
          }
        }
      )

      updateControls(controls)
    }

    run()
  }

  componentDidMount () {
    const self = this

    const run = async () => {
      await BrowserCodeReader.listVideoInputDevices()
        .then(
          devices => self.setState((state, _) => {
            return {
              selectedDevice: devices[0].deviceId,
              reader: state.reader,
              currentControls: state.currentControls
            }
          }))
        .catch(console.info)

      self.runScanner()
    }

    run()
  }

  componentWillUnmount () {
    // Stop the scan if the component is unmounting.
    if (this.state.currentControls !== undefined) {
      this.state.currentControls.stop()
    }
  }

  render () {
    const self = this
    return (
      <div className="flex flex-col gap-4">
        <video
          id='scanner-preview'
          width='512'
          height='512'
          className="darker-div" />

        {(self.showReset && self.state.currentControls === undefined) &&
          <button className="general-button grow" onClick={() => this.runScanner()}>
            Reset
          </button>}
      </div>
    )
  }
}
