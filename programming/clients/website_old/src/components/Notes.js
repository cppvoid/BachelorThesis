import React, { Component } from 'react'
import { connect } from "react-redux"
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import './App.css'
import { getNotes } from '../actions'

class Notes extends Component {
  
  constructor(props) {
    super(props)
    this.props.getNotes(this.props.match.params.id)
  }
  
  render() {
    return (
        <div className="App">
          <input value={this.props.state.categories ? this.props.state.categories.docs.find(category => category._id === this.props.match.params.id).name : ''}/>
          <ReactTable
            columns={[{
              Header: 'ID',
              accessor: '_id'
            }, {
              Header: 'Title',
              accessor: 'title'
            }]}
            manual
            data={this.props.state.notes ? this.props.state.notes.docs : []}
            pages={this.props.state.notes ? this.props.state.notes.totalPages : -1}
            page={this.props.state.notes ? this.props.state.notes.page -1 : -1}
            pageSizeOptions={[5]}
            pageSize={5}
            onPageChange={pageIndex => this.props.getNotes(pageIndex+1)}
            getTdProps={(state, rowInfo, column, instance) => {
              return {
                onClick: (e, handleOriginal) => {
           
                  // IMPORTANT! React-Table uses onClick internally to trigger
                  // events like expanding SubComponents and pivots.
                  // By default a custom 'onClick' handler will override this functionality.
                  // If you want to fire the original onClick handler, call the
                  // 'handleOriginal' function.
                  if (handleOriginal) {
                    handleOriginal()
                  }
                }
              }
            }}
          >
          </ReactTable>
          <button 
            style={{width: '33%', height: '45px', color: 'white', backgroundColor: 'blue', borderRadius: '10px'}}
            onClick={() => this.props.history.push('/')}
          >
              Back
          </button>
          <button 
            style={{width: '33%', height: '45px', color: 'white', backgroundColor: 'red', borderRadius: '10px'}}
            onClick={() => this.props.history.push('/')}
          >
              Delete
          </button>
          <button style={{width: '33%', height: '45px', color: 'white', backgroundColor: 'green', borderRadius: '10px'}}>
              Create
          </button>
        </div>
      )
    }
}

const mapStateToProps = state => {
  return { state };
}

export default connect(mapStateToProps, {
    getNotes
})(Notes);


