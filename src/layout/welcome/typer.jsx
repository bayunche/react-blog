import React from 'react'
import ReactDOM from 'react-dom'
import Typist from 'react-typist'
import './index.scss'

export class Typer extends React.Component {
  state = {
    renderMsg: false,
  }

  onHeaderTyped = () => {
    this.setState({ renderMsg: true })
  }

  render() {
    const docs = '//github.com/bayunche/react-blog'
    const homepage = '//www.hasunemiku.top/home'
    return (
      <div className='typer'>
        <Typist className='typer-header' avgTypingDelay={100} startDelay={2000} onTypingDone={this.onHeaderTyped}>
          <a href={homepage}>欢迎来到八云澈的blog</a>
        </Typist>
        <div className='typer-content'>
          {this.state.renderMsg ? (
            <Typist className='typer-message' cursor={{ hideWhenDone: true }}>
             和你们这些少爷不同，我们光是活着就竭尽全力了。
              <Typist.Delay ms={1250} />
              <br />
              <span>
                *{' '}
                <a href={docs} className='flash'>
                  欢迎 PR&Star
                </a>
              </span>
              <br />
              {''}
            </Typist>
          ) : null}
        </div>
      </div>
    )
  }
}
