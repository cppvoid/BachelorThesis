import React, { Component } from 'react'
import { connect } from "react-redux"
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Route, Switch, Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import './App.css'
import { getCategories } from '../actions'

class Categories extends Component {
  
  constructor(props) {
    super(props)
    this.props.getCategories()
  }
  
  render() {
    return (
        <div className="App">
          <ReactTable
            columns={[{
              Header: 'ID',
              accessor: '_id'
            }, {
              Header: 'Name',
              accessor: 'name'
            }]}
            manual
            data={this.props.state.categories ? this.props.state.categories.docs : []}
            pages={this.props.state.categories ? this.props.state.categories.totalPages : -1}
            page={this.props.state.categories ? this.props.state.categories.page -1 : -1}
            pageSizeOptions={[5]}
            pageSize={5}
            onPageChange={pageIndex => this.props.getCategories(pageIndex+1)}
            getTdProps={(state, rowInfo, column, instance) => {
              return {
                onClick: (e, handleOriginal) => {
                  this.props.history.push(`/category/${rowInfo.original._id}`)
           
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
            <button style={{width: '100%', height: '45px', color: 'white', backgroundColor: 'green', borderRadius: '10px'}}>
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
  getCategories
})(Categories);


