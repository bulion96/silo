;
const React = require('react');
const {Table, Column, Cell} = require('fixed-data-table');
const Measure = require('react-measure');
const DataStoreWrapper = require('./DataStoreWrapper');
const DownloadDataLink = require('../Common/DownloadDataLink');
const UploadModalMenu = require('./UploadModal');
const TextCell = require('./TextCell');
const LocationCell = require('./LocationCell');
const Datetime = require('../Common/Datetime');
const Link = require('./../Common/Link');

/**
 * Edit a set of Operations
 * @type {*}
 */
class OperationEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dimensions: {
                width: -1,
                height: -1,
            },
            data: {},
            filteredDataList: null
        };

        this._onFilterChange = this._onFilterChange.bind(this);
    }

    _onFilterChange(e) {
        if (this.prop)
        if (!e.target.value) {
            this.setState({
                filteredDataList: null,
            });
        }

        let filterBy = e.target.value.toLowerCase();
        let size = this.props.operations.getSize();
        let filteredIndexes = [];
        for (let index = 0; index < size; index++) {
            let {product, quantity} = this.props.operations.getObjectAt(index);
            if (product.toLowerCase().indexOf(filterBy) !== -1) {
                filteredIndexes.push(index);
            }
        }

        this.setState({
            filteredDataList: new DataStoreWrapper(filteredIndexes, this.props.operations),
        });
    }

    render(){
        let operations = this.state.filteredDataList || this.props.operations;
        /*
         <li><input
         onChange={this._onFilterChange}
         placeholder="Filter by SKU"
         /></li>
         */
        return (
            <div className="panel panel-default">
                <div className="panel-heading nav navbar-default">
                    <div>
                        <div>
                            <ul className="nav navbar-nav">
                                <li><h4>OperationEditor</h4></li>
                                <li><span>{operations.getSize()} operations</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {operations.getSize() > 0 ?
                    <Measure onMeasure={(dimensions)=>{this.setState({dimensions});}}>
                        <div className="panel-body panel-body_noPadding">
                            {this.state.dimensions.width != -1 && (
                                <Table
                                    width={this.state.dimensions.width} // Bootstrap 15px padding on row
                                    height={400}
                                    headerHeight={36}
                                    offsetHeight={150}
                                    rowsCount={operations.getSize()}
                                    rowHeight={36}>
                                    <Column
                                        width={40}
                                        header="#"
                                        cell={({rowIndex}) => (
                                            <Cell>
                                                <Link route="operation" code={operations.getObjectAt(rowIndex)['id']} />
                                            </Cell>
                                        )}
                                    />
                                    <Column
                                        width={100}
                                        header="Type"
                                        cell={<TextCell data={operations} col="type" />}
                                    />
                                    <Column
                                        width={75}
                                        header="Source"
                                        cell={<LocationCell data={operations} col="source" />}
                                    />

                                    <Column
                                        width={75}
                                        header="Target"
                                        cell={<LocationCell data={operations} col="target" />}
                                    />
                                    <Column
                                        width={175}
                                        header="Context"
                                        cell={({rowIndex}) => (
                                            <Cell>
                                                {operations.getObjectAt(rowIndex).contexts.map(function(context, key){
                                                    return <span key={key}>{context.name + ' ' +context.value}</span>;
                                                })}
                                            </Cell>
                                        )}
                                    />
                                    <Column
                                        width={250}
                                        header="Request"
                                        cell={({rowIndex}) => (
                                            <Cell>
                                                <Datetime>{operations.getObjectAt(rowIndex)['status']['requestedAt']}</Datetime>&nbsp;
                                                {operations.getObjectAt(rowIndex)['status']['requestedBy']}
                                            </Cell>
                                        )}
                                    />
                                    <Column
                                        width={250}
                                        header="Done"
                                        cell={({rowIndex}) => (
                                            <Cell>
                                                <Datetime>{operations.getObjectAt(rowIndex)['status']['doneAt']}</Datetime>&nbsp;
                                                {operations.getObjectAt(rowIndex)['status']['doneBy']}
                                            </Cell>
                                        )}
                                    />
                                    <Column
                                        width={250}
                                        header="Cancelled"
                                        cell={({rowIndex}) => (
                                            <Cell>
                                                <Datetime>{operations.getObjectAt(rowIndex)['status']['cancelledAt']}</Datetime>&nbsp;
                                                {operations.getObjectAt(rowIndex)['status']['cancelledBy']}
                                            </Cell>
                                        )}
                                    />
                                </Table>
                            )}
                        </div>
                    </Measure> : <div className="panel-body">Fetching or no data...</div>
                }
            </div>
        );
    }
}

module.exports = OperationEditor;

OperationEditor.propTypes = {
    // batches: React.PropTypes.isRequired // new DataStore
};

