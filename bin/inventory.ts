#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {InventoryPipeline} from '../lib/inventory-pipeline'

const app = new cdk.App();
new InventoryPipeline(app, 'InventoryPipeline');