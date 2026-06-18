// dus-frontend/src/Shared/DynamicSectionRenderer.jsx

// React
import { Suspense } from 'react';

// Import section loader
import SectionLoader from './SectionLoader';

// Import section registry
import { SECTION_COMPONENTS, SECTION_CONFIGS } from '../config/sectionRegistry';

const DynamicSectionRenderer = ({
  section,           // Section config from SECTION_ORDER_CONFIG
  pageData,          // All page data (sectionDataMap)
  globalProps = {}   // Global props like storageUrl
}) => {

  console.log(section);

  const {
    id,
    component: componentName,
    propName,
    dataKey,
    customProps = {},
  } = section;

  // Get the component from registry
  const Component = SECTION_COMPONENTS[componentName];

  if (!Component) {
    console.warn(`Component "${componentName}" not found in registry`);
    return null;
  }

  // Build component props
  let componentProps = { ...customProps, ...globalProps };

  // Get config for this component
  const config = SECTION_CONFIGS[componentName];

  if (config?.isMultiProp) {
    // Handle multi-prop components (like BlogSection)
    config.props.forEach(prop => {
      if (pageData[prop] !== undefined) {
        componentProps[prop] = pageData[prop];
      }
    });
  } else if (propName && dataKey) {
    // Handle standard single prop sections
    // Try multiple ways to get the data
    let dataValue = pageData[dataKey];

    // If not found, try with the transformed key (kebab-case)
    if (dataValue === undefined && dataKey) {
      // Try to transform the key
      const kebabKey = dataKey.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      dataValue = pageData[kebabKey];
    }

    // If still not found, try the propName as a key
    if (dataValue === undefined && propName) {
      dataValue = pageData[propName];
      const kebabPropName = propName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      if (dataValue === undefined) {
        dataValue = pageData[kebabPropName];
      }
    }

    componentProps[propName] = dataValue;
  } else if (propName) {
    // Fallback: use propName as both prop and dataKey
    let dataValue = pageData[propName];
    if (dataValue === undefined) {
      const kebabPropName = propName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      dataValue = pageData[kebabPropName];
    }
    componentProps[propName] = dataValue;
  }

  // If component expects 'data' prop, try to find it
  if (componentProps[propName] === undefined) {
    // Try to find any data that might match
    const possibleKeys = [
      section.data_key,
      propName,
      section.data_key?.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
      propName?.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
      componentName.replace('Section', '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
    ];

    for (const key of possibleKeys) {
      if (key && pageData[key] !== undefined) {
        componentProps[propName || 'data'] = pageData[key];
        break;
      }
    }
  }

  return (
    <Suspense fallback={<SectionLoader message={`Loading ${id}...`} />}>
      <Component {...componentProps} />
    </Suspense>
  );
};

export default DynamicSectionRenderer;