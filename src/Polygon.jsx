import React, {Component, PropTypes} from 'react';
import api from './api';

const compareBoundaries = (boundary1, boundary2) => {
  if (boundary1 == boundary2) {
      return true;
  } else if ((boundary1 && !boundary2) || (!boundary1 && boundary2)) {
      return false;
  } else if (boundary1.length != boundary2.length) {
      return false;
  } else {
      return boundary1.every((x, idx) => {
          const y = boundary2[idx];
          return x[0] == y[0] && x[1] == y[1];
      });
  }
};

class Polygon extends Component {

    static defaultProps = {
        internalBoundary: [],
        options: {},
        properties: {},
        drawing: false,
        editing: false
    }

    static propTypes = {
        externalBoundary: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
        internalBoundary: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
        properties: PropTypes.object,
        options: PropTypes.object,
        drawing: PropTypes.bool,
        editing: PropTypes.bool
    }

    static contextTypes = {
        mapController: PropTypes.object
    }

    constructor (props) {
        super(props);
    }

    componentDidMount () {
        const {externalBoundary, internalBoundary, properties, options} = this.props;
        this._ypolygon = new (api.getAPI()).Polygon([externalBoundary, internalBoundary], properties, options);

        this.context.mapController.appendGeoObject(this._ypolygon);

        if (this.props.drawing) {
            this._ypolygon.editor.startDrawing();
        }
        if (this.props.editing) {
            this._ypolygon.editor.startEditing();
        }
    }

    componentDidUpdate (prevProps) {
        const {externalBoundary, internalBoundary, editing, drawing, properties, options} = this.props;

        if (!compareBoundaries(prevProps.externalBoundary, externalBoundary) ||
              !compareBoundaries(prevProps.internalBoundary, internalBoundary)) {
            this._ypolygon.geometry.setCoordinates([externalBoundary, internalBoundary]);
        }

        Object.keys(properties).forEach(propName => {
            if (!prevProps.properties || properties[propName] !== prevProps.properties[propName]) {
                this._ypolygon.properties.set(propName, properties[propName]);
            }
        });

        Object.keys(options).forEach(optName => {
            if (!prevProps.options || options[optName] !== prevProps.options[optName]) {
                this._ypolygon.options.set(optName, options[optName]);
            }
        });

        if (prevProps.drawing != drawing) {
            this._ypolygon.editor[drawing ? "startDrawing" : "stopDrawing"]();
        }
        if (prevProps.editing != editing) {
            this._ypolygon.editor[editing ? "startEditing" : "stopEditing"]();
        }
    }

    componentWillUnmount () {
        this.context.mapController.removeGeoObject(this._ypolygon);
    }

    getExternalBoundary () {
        return this._ypolygon.geometry.getCoordinates()[0];
    }

    getInternalBoundary () {
        return this._ypolygon.geometry.getCoordinates()[1];
    }

    render () {
        return null;
    }
}

export default Polygon;
